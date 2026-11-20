/**
 * @file Input Sanitization Middleware
 * @description Strips malicious HTML/JS from all string fields in request bodies.
 * @module server/middleware/sanitizer
 */

import type { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

/**
 * Recursively sanitizes all string values in an object, removing HTML/JS.
 * @param obj - The input value to sanitize.
 * @returns The sanitized value.
 */
function deepSanitize(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return sanitizeHtml(obj, { allowedTags: [], allowedAttributes: {} });
  }
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[key] = deepSanitize(value);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Express middleware that sanitizes all string fields in request body.
 * @param req - Express request object.
 * @param _res - Express response object (unused).
 * @param next - Express next function.
 */
export function sanitizerMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }
  next();
}
