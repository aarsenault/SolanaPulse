import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import { Cache, initializeCache } from './utils/cacheUtils';

const app = express();
const PORT = 3000;

// Create an in-memory cache
export const cache: Cache = {};

// Populate cache data on startup.
initializeCache();

// Accept requests only from dev front end server for now.
// Make sure the FE app is running on this port
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
