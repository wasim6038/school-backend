import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRoutes from './routes/index.js';
import logger from './utils/logger.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import applySecurityMiddlewares from './middlewares/security.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import notFound from './middlewares/notFound.middleware.js';

const app = express();

// Trust the first proxy hop (Render/Vercel/NGINX) so secure cookies & rate
// limiting see the real client IP/protocol.
app.set('trust proxy', 1);

// --- Security ---
applySecurityMiddlewares(app);

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
app.use(compression());

// --- Logging ---
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: { write: (msg) => logger.info(msg.trim()) }
  })
);

app.use('/api/v1', apiRoutes);

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'School Website API is running' });
});

// --- Error handling ---
app.use(notFound);
app.use(errorMiddleware);

export default app;
