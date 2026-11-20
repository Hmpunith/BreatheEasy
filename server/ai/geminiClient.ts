/**
 * @file Google Gemini AI Client Service
 * @description Gemini 2.5 Flash client with LRU caching, error resiliency, and deterministic fallbacks.
 * @module server/ai/geminiClient
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { LRUCache } from 'lru-cache';
import {
  GEMINI_API_KEY,
  GEMINI_MODEL,
  CACHE_MAX_ENTRIES,
  CACHE_TTL_MS,
} from '../core/config.js';
import { logger } from '../core/logger.js';
import {
  AIRSENSE_SYSTEM_PROMPT,
  buildGroundingContext,
  getDeterministicFallback,
} from './promptVault.js';
import type { FamilyProfile } from '../domains/routines/routineEngine.js';

/** Cache instance for memoizing AI responses. */
const aiCache = new LRUCache<string, string>({
  max: CACHE_MAX_ENTRIES,
  ttl: CACHE_TTL_MS,
});

/** Google Gemini SDK client instance if key is available. */
const genAi = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Generates an advice response from the AirSense Copilot.
 * Falls back to deterministic heuristics when API is unavailable or offline.
 * @param prompt - User prompt or query.
 * @param aqi - Current AQI context.
 * @param location - Current user location.
 * @param profile - Optional family demographic and vulnerability profile.
 * @returns Generated guidance text.
 */
export async function askAirSenseCopilot(
  prompt: string,
  aqi: number,
  location: string,
  profile?: FamilyProfile,
): Promise<{ reply: string; source: 'gemini' | 'cache' | 'fallback' }> {
  const cacheKey = `${aqi}:${location}:${prompt.trim().toLowerCase()}`;
  const cached = aiCache.get(cacheKey);

  if (cached) {
    logger.info({ cacheKey }, 'AirSense Copilot cache hit');
    return { reply: cached, source: 'cache' };
  }

  if (!genAi || process.env.NODE_ENV === 'test') {
    const fallback = getDeterministicFallback(prompt, aqi);
    aiCache.set(cacheKey, fallback);
    return {
      reply: fallback,
      source: 'fallback',
    };
  }

  try {
    const model = genAi.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: AIRSENSE_SYSTEM_PROMPT,
    });

    const grounding = buildGroundingContext(aqi, location, profile);
    const fullMessage = `${grounding}\nUser Question: ${prompt}`;

    const result = await model.generateContent(fullMessage);
    const text = result.response.text();

    if (text && text.trim().length > 0) {
      aiCache.set(cacheKey, text);
      return { reply: text, source: 'gemini' };
    }

    return {
      reply: getDeterministicFallback(prompt, aqi),
      source: 'fallback',
    };
  } catch (error) {
    logger.error({ error }, 'Failed to query Gemini API; using fallback');
    return {
      reply: getDeterministicFallback(prompt, aqi),
      source: 'fallback',
    };
  }
}

/**
 * Returns cache statistics for health monitoring.
 * @returns Current size and capacity.
 */
export function getAiCacheMetrics(): { size: number; max: number } {
  return {
    size: aiCache.size,
    max: aiCache.max,
  };
}
