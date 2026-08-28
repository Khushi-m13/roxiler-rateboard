import { query } from '../db/pool.js';

const storeSortFields = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
  rating: 'rating',
};

function getSort(field, direction) {
  const column = storeSortFields[field] || storeSortFields.name;
  const order = direction === 'desc' ? 'DESC' : 'ASC';
  return `${column} ${order}`;
}

export async function listStores({ name = '', address = '', sort = 'name', dir = 'asc', userId }) {
  const orderBy = getSort(sort, dir);

  return query(
    `SELECT
       s.id,
       s.name,
       s.email,
       s.address,
       ROUND(AVG(r.rating), 1) AS rating,
       my_rating.rating AS myRating,
       my_rating.id AS ratingId
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings my_rating
       ON my_rating.store_id = s.id AND my_rating.user_id = ?
     WHERE LOWER(s.name) LIKE LOWER(?) AND LOWER(s.address) LIKE LOWER(?)
     GROUP BY s.id, my_rating.id, my_rating.rating
     ORDER BY ${orderBy}`,
    [userId, `%${name}%`, `%${address}%`],
  );
}

export async function findStore(storeId, userId) {
  const rows = await query(
    `SELECT
       s.id,
       s.name,
       s.email,
       s.address,
       ROUND(AVG(r.rating), 1) AS rating,
       my_rating.rating AS myRating,
       my_rating.id AS ratingId
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings my_rating
       ON my_rating.store_id = s.id AND my_rating.user_id = ?
     WHERE s.id = ?
     GROUP BY s.id, my_rating.id, my_rating.rating`,
    [userId, storeId],
  );

  return rows[0] || null;
}

export async function createStore({ name, email, address, ownerId = null }) {
  const result = await query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES (?, ?, ?, ?)`,
    [name.trim(), email.trim().toLowerCase(), address.trim(), ownerId || null],
  );

  return result.insertId;
}
