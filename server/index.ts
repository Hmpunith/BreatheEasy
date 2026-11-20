/**
 * @file BreatheEasy Server Application Setup
 * @description Express app initialization, middleware assembly, and listener startup.
 * @module server/index
 */

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { PORT, MAX_BODY_SIZE } from './core/config.js';
import { logger } from './core/logger.js';
import { helmetMiddleware, extraSecurityHeaders } from './middleware/shield.js';
import { throttleMiddleware } from './middleware/throttle.js';
import { sanitizerMiddleware } from './middleware/sanitizer.js';
import { faultBarrier } from './middleware/faultBarrier.js';
import { apiRouter } from './routes/api.js';

export const app = express();

// Security and compression
app.use(helmetMiddleware);
app.use(extraSecurityHeaders);
app.use(compression());
app.use(cors());

// Parsing and sanitization
app.use(express.json({ limit: MAX_BODY_SIZE }));
app.use(sanitizerMiddleware);

// Rate limiting
app.use('/api', throttleMiddleware);

// API Routes
app.use('/api', apiRouter);

// Centralized error handler registered LAST
app.use(faultBarrier);

// Start server if executed directly and not under test runners or serverless
if (!process.env.VITEST && process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info({ port: PORT }, 'BreatheEasy server listening');
  });
}
