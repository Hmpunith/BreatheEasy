/**
 * @file BreatheEasy Server Configuration
 * @description Centralized environment variables and application constants.
 * @module server/core/config
 */

/** Application port for local development. */
export const PORT = parseInt(process.env.PORT || '3001', 10);

/** Google Gemini API key sourced from environment. */
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/** Gemini model identifier for generative AI requests. */
export const GEMINI_MODEL = 'gemini-2.5-flash';

/** Maximum request body size in bytes (512 KB). */
export const MAX_BODY_SIZE = '512kb';

/** Rate limit: maximum requests per window per IP. */
export const RATE_LIMIT_POINTS = 20;

/** Rate limit: window duration in seconds. */
export const RATE_LIMIT_DURATION = 60;

/** Cache TTL in milliseconds (10 minutes). */
export const CACHE_TTL_MS = 10 * 60 * 1000;

/** Maximum cached entries. */
export const CACHE_MAX_ENTRIES = 200;

/** Application version from package metadata. */
export const APP_VERSION = '1.0.0';

/** Application name. */
export const APP_NAME = 'BreatheEasy';
