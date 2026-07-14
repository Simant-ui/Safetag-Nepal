import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalApiRateLimiter } from './middleware/rateLimit';

export const app = express();

app.set('trust proxy', true);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/non-browser requests (no Origin header) and any configured origin.
      if (!origin || env.webAppOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use(express.json());
app.use(generalApiRateLimiter);

app.get('/health', (_req, res) => res.json({ ok: true }));

// Mounted at root to match the paths already fixed by web/src/services/*/*.http.ts
// (e.g. apiClient.get('/users/:id') -> http://localhost:4000/users/:id, no /api prefix).
app.use('/', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
