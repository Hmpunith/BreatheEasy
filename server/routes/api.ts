/**
 * @file API Router
 * @description Express routing layer connecting controllers, validation schemas, and domain engines.
 * @module server/routes/api
 */

import { Router } from 'express';
import * as v from 'valibot';
import { APP_NAME, APP_VERSION } from '../core/config.js';
import { InputValidationError } from '../core/errors.js';
import { classifyAqi } from '../domains/aqi/aqiClassifier.js';
import { POLLUTANT_CATALOG } from '../domains/aqi/pollutantData.js';
import { generateDailyRoutine } from '../domains/routines/routineEngine.js';
import { queryIndoorHacks } from '../domains/indoor/hackCatalog.js';
import { recommendIndoorHacks } from '../domains/indoor/hackEngine.js';
import { calculateImpact } from '../domains/impact/calculator.js';
import { queryAlternatives } from '../domains/alternatives/alternativeCatalog.js';
import { matchSustainableAlternatives } from '../domains/alternatives/greenEngine.js';
import { askAirSenseCopilot, getAiCacheMetrics } from '../ai/geminiClient.js';
import {
  ChatRequestSchema,
  AqiClassifySchema,
  RoutineGenerateSchema,
  HackRecommendSchema,
  ImpactCalculateSchema,
  AlternativesMatchSchema,
} from '../validation/schemas.js';

export const apiRouter = Router();

/** Health check endpoint. */
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: APP_NAME,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    cache: getAiCacheMetrics(),
  });
});

/** Interactive Copilot chat endpoint. */
apiRouter.post('/chat', async (req, res, next) => {
  try {
    const parse = v.safeParse(ChatRequestSchema, req.body);
    if (!parse.success) {
      throw new InputValidationError(parse.issues[0]?.message || 'Invalid chat payload.');
    }
    const { prompt, aqi = 145, location = 'New Delhi, India', profile } = parse.output;
    const response = await askAirSenseCopilot(prompt, aqi, location, profile);
    res.json({ success: true, ...response });
  } catch (error) {
    next(error);
  }
});

/** AQI classification endpoint. */
apiRouter.post('/aqi/classify', (req, res, next) => {
  try {
    const parse = v.safeParse(AqiClassifySchema, req.body);
    if (!parse.success) {
      throw new InputValidationError(parse.issues[0]?.message || 'Invalid AQI value.');
    }
    const result = classifyAqi(parse.output.aqi);
    res.json({ success: true, classification: result });
  } catch (error) {
    next(error);
  }
});

/** Pollutant master reference catalog endpoint. */
apiRouter.get('/aqi/pollutants', (_req, res) => {
  res.json({ success: true, pollutants: POLLUTANT_CATALOG });
});

/** Daily routine planner generator endpoint. */
apiRouter.post('/routines/generate', (req, res, next) => {
  try {
    const parse = v.safeParse(RoutineGenerateSchema, req.body);
    if (!parse.success) {
      throw new InputValidationError(parse.issues[0]?.message || 'Invalid routine parameters.');
    }
    const routine = generateDailyRoutine(parse.output.aqi, parse.output.profile);
    res.json({ success: true, routine });
  } catch (error) {
    next(error);
  }
});

/** Indoor hack catalog query endpoint. */
apiRouter.get('/hacks', (_req, res) => {
  const hacks = queryIndoorHacks();
  res.json({ success: true, hacks });
});

/** Indoor hack personalized recommendation endpoint. */
apiRouter.post('/hacks/recommend', (req, res, next) => {
  try {
    const parse = v.safeParse(HackRecommendSchema, req.body);
    if (!parse.success) {
      throw new InputValidationError(parse.issues[0]?.message || 'Invalid home profile.');
    }
    const recommendations = recommendIndoorHacks(parse.output.aqi, parse.output.profile);
    res.json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
});

/** Environmental and particulate emission calculator endpoint. */
apiRouter.post('/impact/calculate', (req, res, next) => {
  try {
    const parse = v.safeParse(ImpactCalculateSchema, req.body);
    if (!parse.success) {
      throw new InputValidationError(parse.issues[0]?.message || 'Invalid impact calculation payload.');
    }
    const report = calculateImpact(parse.output);
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

/** Sustainable alternatives catalog endpoint. */
apiRouter.get('/alternatives', (_req, res) => {
  const alternatives = queryAlternatives();
  res.json({ success: true, alternatives });
});

/** Sustainable alternatives matching endpoint. */
apiRouter.post('/alternatives/match', (req, res, next) => {
  try {
    const parse = v.safeParse(AlternativesMatchSchema, req.body);
    if (!parse.success) {
      throw new InputValidationError(parse.issues[0]?.message || 'Invalid lifestyle goals.');
    }
    const matches = matchSustainableAlternatives(parse.output);
    res.json({ success: true, matches });
  } catch (error) {
    next(error);
  }
});
