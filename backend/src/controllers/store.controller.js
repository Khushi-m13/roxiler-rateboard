import { query } from '../db/pool.js';
import { createStore, findStore, listStores } from '../services/store.service.js';
import { validateStoreInput } from '../validators/index.js';

export async function storesController(req, res, next) {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const rows = await listStores({
      name: req.query.name,
      address: req.query.address,
      sort: req.query.sort,
      dir: req.query.dir,
      userId: req.user.id,
    });

    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

export async function storeController(req, res, next) {
  try {
    const store = await findStore(Number(req.params.id), req.user.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    return res.json(store);
  } catch (error) {
    return next(error);
  }
}

export async function createStoreController(req, res, next) {
  try {
    const errors = validateStoreInput(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(' ') });
    }

    let ownerId = null;
    if (req.body.ownerId) {
      ownerId = Number(req.body.ownerId);
      const owners = await query(
        `SELECT id FROM users WHERE id = ? AND role = 'owner'`,
        [ownerId],
      );

      if (owners.length === 0) {
        return res.status(400).json({ message: 'Selected store owner does not exist.' });
      }
    }

    const id = await createStore({ ...req.body, ownerId });
    return res.status(201).json({ id, message: 'Store created successfully.' });
  } catch (error) {
    return next(error);
  }
}
