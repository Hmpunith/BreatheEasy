/**
 * @file Input Sanitization Middleware
 * @description Strips malicious HTML/JS from all string fields in request bodies.
 * @module server/middleware/sanitizer
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Strips HTML tags, script blocks, inline event handlers, and javascript: protocols.
 * Pure native regex implementation with zero external CJS/ESM bundling issues.
 * @param input - The raw string to sanitize.
 * @returns Cleaned string without markup or executable script injection.
 */
function stripHtmlTags(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript\s*:[^"']*/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .trim();
}

/**
 * Recursively sanitizes all string values in an object, removing HTML/JS.
 * @param obj - The input value to sanitize.
 * @returns The sanitized value.
 */
function deepSanitize(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return stripHtmlTags(obj);
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
