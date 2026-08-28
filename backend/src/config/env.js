import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const backendRoot = path.resolve(path.dirname(currentFile), '../..');

// Loading by absolute path makes the backend work even when the command is
// started from the project root instead of the backend directory.
dotenv.config({ path: path.join(backendRoot, '.env') });

const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn(`Missing environment variable(s): ${missing.join(', ')}`);
}

export const env = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rateboard',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
  serverPort: Number(process.env.PORT || 5000),
};

export function hasDatabaseConfiguration() {
  return required.every((key) => Boolean(process.env[key]));
}
