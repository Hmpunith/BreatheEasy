/**
 * @file Centralized Error Handler
 * @description Final Express middleware for structured error responses.
 * @module server/middleware/faultBarrier
 */

import type { Request, Response, NextFunction } from 'express';
import { AirQualityError } from '../core/errors.js';
import { createRequestLogger } from '../core/logger.js';

/**
 * Centralized error-handling middleware. Must be registered LAST in the Express chain.
 * Converts AirQualityError instances into structured JSON responses.
 * @param err - The error thrown by upstream middleware or route handlers.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param _next - Express next function (unused, required for Express error handler signature).
 */
export function faultBarrier(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = (req.headers['x-request-id'] as string) || 'unknown';
  const log = createRequestLogger(requestId);

  if (err instanceof AirQualityError) {
    log.warn({ code: err.code, statusCode: err.statusCode }, err.message);
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
      requestId,
    });
    return;
  }

  log.error({ err }, 'Unexpected internal error');
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    },
    requestId,
  });
}
