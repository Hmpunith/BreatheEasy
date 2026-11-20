/**
 * @file Structured JSON Logger
 * @description Pino-based structured logging with request correlation.
 * @module server/core/logger
 */

import pino from 'pino';
import { APP_NAME } from './config.js';

/**
 * Application-wide structured logger instance.
 * Outputs JSON logs with ISO timestamps, service name, and severity levels.
 */
export const logger = pino({
  name: APP_NAME,
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label: string) {
      return { severity: label.toUpperCase() };
    },
  },
});

/**
 * Creates a child logger bound with a request ID for correlation.
 * @param requestId - Unique identifier for the current request.
 * @returns A child Pino logger instance.
 */
export function createRequestLogger(requestId: string): pino.Logger {
  return logger.child({ requestId });
}
