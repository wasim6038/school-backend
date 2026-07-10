import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRoutes from './routes/index.js';
import logger from './utils/logger.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (curl/Postman) which send no Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      logger.warn(`CORS blocked request from disallowed origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(globalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/v1', apiRoutes);

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'School Website API is running' });
});

export default app;
