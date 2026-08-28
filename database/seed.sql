USE rateboard;

-- Demo users need bcrypt password hashes, so the recommended seed command is:
--   cd backend
--   npm install
--   npm run db:seed
--
-- The Node seed script generates a fresh bcrypt hash for Password@1 and then
-- inserts/updates the demo users, stores and ratings. This SQL file is kept as
-- a database-side seed helper and verification script for MySQL Workbench.

-- Safe sample stores. The Node seed script will assign the correct owner IDs.
INSERT INTO stores (name, email, address)
SELECT 'Copper Spoon Cafe Pune', 'copperspoon@example.com', 'Viman Nagar, Pune'
WHERE NOT EXISTS (
  SELECT 1 FROM stores WHERE email = 'copperspoon@example.com'
);

INSERT INTO stores (name, email, address)
SELECT 'Maple Street Books Pune', 'maplestreet@example.com', 'Aundh, Pune'
WHERE NOT EXISTS (
  SELECT 1 FROM stores WHERE email = 'maplestreet@example.com'
);

-- Verify the three core tables after running the Node seed:
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_stores FROM stores;
SELECT COUNT(*) AS total_ratings FROM ratings;
