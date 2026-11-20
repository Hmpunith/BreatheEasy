/**
 * @file Security Shield Middleware
 * @description HTTP security headers including CSP, HSTS, and Permissions-Policy.
 * @module server/middleware/shield
 */

import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';

/**
 * Applies Helmet security defaults with strict CSP configuration.
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://generativelanguage.googleapis.com'],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
});

/**
 * Adds Permissions-Policy, X-Permitted-Cross-Domain-Policies, and X-Request-Id headers.
 * These are NOT set by Helmet and must be added manually.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export function extraSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  const requestId = uuidv4();
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-Request-Id', requestId);
  req.headers['x-request-id'] = requestId;
  next();
}
