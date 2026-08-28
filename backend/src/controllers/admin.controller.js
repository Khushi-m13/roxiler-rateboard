import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { validateStoreInput, validateUserInput } from '../validators/index.js';

const userSortFields = {
  name: 'u.name',
  email: 'u.email',
  address: 'u.address',
  role: 'u.role',
};

const storeSortFields = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
  rating: 'rating',
};

function buildOrder(fields, sort, dir, fallback) {
  const column = fields[sort] || fields[fallback];
  const direction = dir === 'desc' ? 'DESC' : 'ASC';
  return `${column} ${direction}`;
}

export async function dashboardController(req, res, next) {
  try {
    const [userCount, storeCount, ratingCount, roleCounts] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM users'),
      query('SELECT COUNT(*) AS total FROM stores'),
      query('SELECT COUNT(*) AS total FROM ratings'),
      query("SELECT role, COUNT(*) AS total FROM users GROUP BY role"),
    ]);

    const roles = { admin: 0, user: 0, owner: 0 };
    roleCounts.forEach((row) => { roles[row.role] = Number(row.total); });

    return res.json({
      users: Number(userCount[0].total),
      stores: Number(storeCount[0].total),
      ratings: Number(ratingCount[0].total),
      roles,
    });
  } catch (error) {
    return next(error);
  }
}

export async function listUsersController(req, res, next) {
  try {
    const name = req.query.name || '';
    const email = req.query.email || '';
    const address = req.query.address || '';
    const role = req.query.role || '';
    const orderBy = buildOrder(userSortFields, req.query.sort, req.query.dir, 'name');

    const users = await query(
      `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at
       FROM users u
       WHERE u.name LIKE ?
         AND u.email LIKE ?
         AND u.address LIKE ?
         AND (? = '' OR u.role = ?)
       ORDER BY ${orderBy}`,
      [`%${name}%`, `%${email}%`, `%${address}%`, role, role],
    );

    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

export async function getUserController(req, res, next) {
  try {
    const users = await query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.address,
         u.role,
         CASE
           WHEN u.role = 'owner' THEN ROUND(AVG(r.rating), 1)
           ELSE NULL
         END AS rating
       FROM users u
       LEFT JOIN stores s ON s.owner_id = u.id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE u.id = ?
       GROUP BY u.id`,
      [req.params.id],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(users[0]);
  } catch (error) {
    return next(error);
  }
}

export async function createUserController(req, res, next) {
  try {
    const role = req.body.role;

    if (!['admin', 'user', 'owner'].includes(role)) {
      return res.status(400).json({ message: 'Invalid user role.' });
    }

    const errors = validateUserInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(' ') });
    }

    const email = req.body.email.trim().toLowerCase();
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [req.body.name.trim(), email, passwordHash, req.body.address.trim(), role],
    );

    return res.status(201).json({ id: result.insertId, message: 'User created successfully.' });
  } catch (error) {
    return next(error);
  }
}


export async function updateUserController(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }

    const existingRows = await query('SELECT id, role FROM users WHERE id = ?', [userId]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (userId === req.user.id && req.body.role && req.body.role !== 'admin') {
      return res.status(400).json({ message: 'You cannot remove your own administrator access.' });
    }

    const role = req.body.role;
    if (!['admin', 'user', 'owner'].includes(role)) {
      return res.status(400).json({ message: 'Invalid user role.' });
    }

    const errors = validateUserInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(' ') });
    }

    const email = req.body.email.trim().toLowerCase();
    const duplicate = await query('SELECT id FROM users WHERE email = ? AND id <> ?', [email, userId]);
    if (duplicate.length > 0) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    await query(
      `UPDATE users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?`,
      [req.body.name.trim(), email, req.body.address.trim(), role, userId],
    );

    if (existingRows[0].role === 'owner' && role !== 'owner') {
      await query('UPDATE stores SET owner_id = NULL WHERE owner_id = ?', [userId]);
    }

    return res.json({ message: 'User updated successfully.' });
  } catch (error) {
    return next(error);
  }
}

export async function deleteUserController(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own administrator account.' });
    }

    const users = await query('SELECT id, role FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (users[0].role === 'admin') {
      const admins = await query("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'");
      if (Number(admins[0].total) <= 1) {
        return res.status(400).json({ message: 'At least one administrator account must remain.' });
      }
    }

    await query('DELETE FROM users WHERE id = ?', [userId]);
    return res.json({ message: 'User removed successfully.' });
  } catch (error) {
    return next(error);
  }
}

export async function listStoresController(req, res, next) {
  try {
    const orderBy = buildOrder(storeSortFields, req.query.sort, req.query.dir, 'name');
    const stores = await query(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.address,
         ROUND(AVG(r.rating), 1) AS rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE LOWER(s.name) LIKE LOWER(?)
         AND LOWER(s.email) LIKE LOWER(?)
         AND LOWER(s.address) LIKE LOWER(?)
       GROUP BY s.id
       ORDER BY ${orderBy}`,
      [
        `%${req.query.name || ''}%`,
        `%${req.query.email || ''}%`,
        `%${req.query.address || ''}%`,
      ],
    );

    return res.json(stores);
  } catch (error) {
    return next(error);
  }
}

export async function ownerDashboardController(req, res, next) {
  try {
    const stores = await query(
      `SELECT id, name, email, address
       FROM stores
       WHERE owner_id = ?
       ORDER BY id
       LIMIT 1`,
      [req.user.id],
    );

    if (stores.length === 0) {
      return res.json({ store: null, average: null, ratings: [] });
    }

    const store = stores[0];
    const [averageRows, ratingRows, distributionRows] = await Promise.all([
      query('SELECT ROUND(AVG(rating), 1) AS average FROM ratings WHERE store_id = ?', [store.id]),
      query(
        `SELECT u.name, u.email, r.rating, r.created_at, r.updated_at
         FROM ratings r INNER JOIN users u ON u.id = r.user_id
         WHERE r.store_id = ? ORDER BY r.updated_at DESC`,
        [store.id],
      ),
      query('SELECT rating, COUNT(*) AS total FROM ratings WHERE store_id = ? GROUP BY rating ORDER BY rating DESC', [store.id]),
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distributionRows.forEach((row) => { distribution[row.rating] = Number(row.total); });

    return res.json({ store, average: averageRows[0].average, ratings: ratingRows, distribution });
  } catch (error) {
    return next(error);
  }
}
