import { query } from '../db/pool.js';

export async function createRating(userId, storeId, rating) {
  const store = await query('SELECT id FROM stores WHERE id = ?', [storeId]);

  if (store.length === 0) {
    return { error: 'STORE_NOT_FOUND' };
  }

  try {
    const result = await query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating],
    );
    return { id: result.insertId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: 'DUPLICATE' };
    }
    throw error;
  }
}

export async function updateRating(userId, ratingId, rating) {
  const rows = await query(
    'SELECT id FROM ratings WHERE id = ? AND user_id = ?',
    [ratingId, userId],
  );

  if (rows.length === 0) {
    return { error: 'NOT_ALLOWED' };
  }

  await query('UPDATE ratings SET rating = ? WHERE id = ?', [rating, ratingId]);
  return { ok: true };
}
