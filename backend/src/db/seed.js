import bcrypt from 'bcryptjs';
import { pool, query } from './pool.js';

const demoPassword = 'Password@1';

const demoUsers = [
  ['System Administrator Account', 'admin@rateboard.example.com', 'Pune, Maharashtra', 'admin'],
  ['Aarav Deshmukh Student', 'aarav@example.com', 'Baner, Pune', 'user'],
  ['Meera Kulkarni Student', 'meera@example.com', 'Kothrud, Pune', 'user'],
  ['Vikram Patil Store Owner', 'owner1@example.com', 'Viman Nagar, Pune', 'owner'],
  ['Neha Shah Store Owner', 'owner2@example.com', 'Aundh, Pune', 'owner'],
];

async function seed() {
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  // Migrate the earlier demo addresses so existing local databases do not
  // keep the old .local email samples after an updated seed.
  await query("UPDATE users SET email = 'admin@rateboard.example.com' WHERE email = 'admin@rateboard.local'");
  await query("UPDATE stores SET email = 'copperspoon@example.com' WHERE email = 'hello@copperspoon.local'");
  await query("UPDATE stores SET email = 'maplestreet@example.com' WHERE email = 'contact@maplestreet.local'");

  for (const [name, email, address, role] of demoUsers) {
    await query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         password_hash = VALUES(password_hash),
         address = VALUES(address),
         role = VALUES(role)`,
      [name, email, passwordHash, address, role],
    );
  }

  const owners = await query("SELECT id, email FROM users WHERE role = 'owner'");

  for (const owner of owners) {
    const store = owner.email === 'owner1@example.com'
      ? ['Copper Spoon Cafe Pune', 'copperspoon@example.com', 'Viman Nagar, Pune']
      : ['Maple Street Books Pune', 'maplestreet@example.com', 'Aundh, Pune'];

    await query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         address = VALUES(address),
         owner_id = VALUES(owner_id)`,
      [...store, owner.id],
    );
  }

  const users = await query("SELECT id, email FROM users WHERE role = 'user'");
  const stores = await query('SELECT id, email FROM stores ORDER BY id');

  const ratings = [
    [users.find((user) => user.email === 'aarav@example.com'), stores.find((store) => store.email === 'copperspoon@example.com'), 5],
    [users.find((user) => user.email === 'meera@example.com'), stores.find((store) => store.email === 'copperspoon@example.com'), 4],
    [users.find((user) => user.email === 'aarav@example.com'), stores.find((store) => store.email === 'maplestreet@example.com'), 4],
  ];

  for (const [user, store, rating] of ratings) {
    if (!user || !store) {
      continue;
    }

    await query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [user.id, store.id, rating],
    );
  }

  console.log('Database seed completed.');
  console.log('Demo password for all seeded accounts:', demoPassword);
}

seed()
  .catch((error) => {
    console.error('Database seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
