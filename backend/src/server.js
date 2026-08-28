import app from './app.js';
import { checkDatabaseConnection } from './db/pool.js';
import { env, hasDatabaseConfiguration } from './config/env.js';

async function startServer() {
  if (!hasDatabaseConfiguration()) {
    console.warn('Backend started without a complete .env file. Create backend/.env before using database features.');
  } else {
    try {
      await checkDatabaseConnection();
      console.log(`MySQL connection established: ${env.database}`);
    } catch (error) {
      console.error('MySQL connection failed. Check backend/.env and make sure MySQL Server is running.');
      console.error(error.message);
    }
  }

  app.listen(env.serverPort, () => {
    console.log(`RateBoard API running on http://localhost:${env.serverPort}`);
  });
}

startServer();
