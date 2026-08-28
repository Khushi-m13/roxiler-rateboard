import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/pool.js';
import { env } from '../config/env.js';

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };
}

export async function registerUser(data) {
  const role = data.role || 'user';
  if (!['user', 'owner'].includes(role)) {
    return { error: 'INVALID_ROLE' };
  }
  const email = data.email.trim().toLowerCase();
  const existing = await query('SELECT id FROM users WHERE email = ?', [email]);

  if (existing.length > 0) {
    return { error: 'EMAIL_EXISTS' };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const result = await query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES (?, ?, ?, ?, ?)`,
    [data.name.trim(), email, passwordHash, data.address.trim(), role],
  );

  return {
    user: publicUser({
      id: result.insertId,
      name: data.name.trim(),
      email,
      address: data.address.trim(),
      role,
    }),
  };
}

export async function loginUser(emailInput, password) {
  const email = emailInput.trim().toLowerCase();
  const rows = await query(
    `SELECT id, name, email, password_hash, address, role
     FROM users
     WHERE email = ?`,
    [email],
  );

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    return null;
  }

  const safeUser = publicUser(user);
  const token = jwt.sign(
    {
      id: safeUser.id,
      name: safeUser.name,
      email: safeUser.email,
      role: safeUser.role,
    },
    env.jwtSecret,
    { expiresIn: '8h' },
  );

  return { token, user: safeUser };
}

export async function updatePassword(userId, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
}
