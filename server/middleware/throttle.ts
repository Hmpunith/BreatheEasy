/**
 * @file Rate Limiter Middleware
 * @description Per-IP request throttling using rate-limiter-flexible.
 * @module server/middleware/throttle
 */

import type { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { RATE_LIMIT_POINTS, RATE_LIMIT_DURATION } from '../core/config.js';
import { ThrottleError } from '../core/errors.js';

const limiter = new RateLimiterMemory({
  points: RATE_LIMIT_POINTS,
  duration: RATE_LIMIT_DURATION,
});

/**
 * Express middleware that enforces per-IP rate limiting.
 * @param req - Express request object.
 * @param _res - Express response object (unused).
 * @param next - Express next function.
 * @throws {ThrottleError} When the client exceeds the allowed request rate.
 */
export async function throttleMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    await limiter.consume(key);
    next();
  } catch {
    next(new ThrottleError());
  }
}
