/**
 * @file Resilience, Error Boundary, and Fallback Unit Tests
 * @description Verifies offline heuristics, LRU caching, and typed application error hierarchies.
 */

import { describe, it, expect } from 'vitest';
import { getDeterministicFallback, AIRSENSE_SYSTEM_PROMPT } from '../../server/ai/promptVault';
import { askAirSenseCopilot, getAiCacheMetrics } from '../../server/ai/geminiClient';
import {
  AirQualityError,
  InputValidationError,
  ThrottleError,
  ResourceNotFoundError,
  AiServiceError,
} from '../../server/core/errors';

describe('Resilience and Fallback Engine Tests', () => {
  it('returns targeted mask guidance when query mentions mask', () => {
    const advice = getDeterministicFallback('Should I wear a cloth mask or N95?', 220);
    expect(advice).toContain('N95 or KN95 respirator');
  });

  it('returns window sealing guidance during severe smog', () => {
    const advice = getDeterministicFallback('Should I open my windows for fresh air?', 240);
    expect(advice).toContain('Keep all windows tightly closed');
  });

  it('returns DIY filtration advice when query mentions purifier or HEPA', () => {
    const advice = getDeterministicFallback('How can I get an affordable purifier?', 180);
    expect(advice).toContain('Corsi-Rosenthal box');
  });

  it('returns general harm reduction advice for generic queries', () => {
    const advice = getDeterministicFallback('What should I do today?', 190);
    expect(advice).toContain('Currently facing AQI 190');
    expect(advice).toContain('mucosal barriers');
  });

  it('contains comprehensive system instructions in AIRSENSE_SYSTEM_PROMPT', () => {
    expect(AIRSENSE_SYSTEM_PROMPT).toContain('AirSense');
    expect(AIRSENSE_SYSTEM_PROMPT).toContain('Hack2Skill PromptWars [Challenge 6]');
  });

  it('memoizes responses in cache and tracks metrics', async () => {
    const initial = getAiCacheMetrics();
    expect(initial.max).toBe(200);

    const res1 = await askAirSenseCopilot('What mask is best?', 200, 'Delhi');
    expect(res1.reply).toBeDefined();

    // Calling identical prompt returns from cache or fallback without throwing
    const res2 = await askAirSenseCopilot('What mask is best?', 200, 'Delhi');
    expect(res2.reply).toBe(res1.reply);
  });

  it('properly formats custom application error classes', () => {
    const base = new AirQualityError('Base fault', 500, 'BASE_FAULT');
    expect(base.statusCode).toBe(500);
    expect(base.code).toBe('BASE_FAULT');
    expect(base.isOperational).toBe(true);

    const val = new InputValidationError('Invalid format');
    expect(val.statusCode).toBe(400);
    expect(val.code).toBe('INPUT_VALIDATION_FAULT');

    const throttle = new ThrottleError();
    expect(throttle.statusCode).toBe(429);

    const notFound = new ResourceNotFoundError('Report');
    expect(notFound.statusCode).toBe(404);

    const ai = new AiServiceError('Timeout');
    expect(ai.statusCode).toBe(502);
  });
});
