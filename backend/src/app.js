import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'rateboard-api' });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'A duplicate record already exists.' });
  }

  if (error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ER_BAD_DB_ERROR') {
    return res.status(500).json({ message: 'Database is not ready. Run the database schema first.' });
  }

  return res.status(500).json({ message: 'Internal server error.' });
});

export default app;
