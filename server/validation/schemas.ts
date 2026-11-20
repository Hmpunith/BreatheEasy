/**
 * @file Valibot Request Validation Schemas
 * @description Strict schema boundary validation for all BreatheEasy API endpoints.
 * @module server/validation/schemas
 */

import * as v from 'valibot';

/** Chat endpoint request payload schema. */
export const ChatRequestSchema = v.object({
  prompt: v.pipe(v.string(), v.minLength(1, 'Prompt cannot be empty.'), v.maxLength(1000)),
  aqi: v.optional(v.pipe(v.number(), v.minValue(0, 'AQI must be non-negative.'))),
  location: v.optional(v.pipe(v.string(), v.maxLength(120))),
  profile: v.optional(
    v.object({
      memberCount: v.pipe(v.number(), v.minValue(1)),
      hasChildren: v.boolean(),
      hasElderly: v.boolean(),
      hasRespiratoryConditions: v.boolean(),
      location: v.string(),
    }),
  ),
});

/** AQI classification request schema. */
export const AqiClassifySchema = v.object({
  aqi: v.pipe(v.number(), v.minValue(0, 'AQI must be non-negative.')),
});

/** Daily routine generation request schema. */
export const RoutineGenerateSchema = v.object({
  aqi: v.pipe(v.number(), v.minValue(0)),
  profile: v.object({
    memberCount: v.pipe(v.number(), v.minValue(1)),
    hasChildren: v.boolean(),
    hasElderly: v.boolean(),
    hasRespiratoryConditions: v.boolean(),
    location: v.pipe(v.string(), v.minLength(1)),
  }),
});

/** Indoor hack recommendation request schema. */
export const HackRecommendSchema = v.object({
  aqi: v.pipe(v.number(), v.minValue(0)),
  profile: v.object({
    homeType: v.picklist(['apartment', 'detached', 'compact_studio']),
    budget: v.picklist(['free_only', 'low_cost', 'open']),
    hasIndoorCombustion: v.boolean(),
    hasPets: v.boolean(),
  }),
});

/** Impact comparison calculation request schema. */
export const ImpactCalculateSchema = v.object({
  baselineActivityId: v.pipe(v.string(), v.minLength(1)),
  alternativeActivityId: v.pipe(v.string(), v.minLength(1)),
  volume: v.pipe(v.number(), v.minValue(0.01, 'Volume must be greater than zero.')),
  frequencyMultiplier: v.pipe(v.number(), v.minValue(1, 'Frequency must be at least 1.')),
});

/** Sustainable alternatives matching request schema. */
export const AlternativesMatchSchema = v.object({
  primaryFocus: v.picklist([
    'health_first',
    'cost_savings',
    'community_impact',
    'maximum_clean_air',
  ]),
  density: v.picklist(['dense_metro', 'suburban', 'regional_town']),
  commuteKm: v.pipe(v.number(), v.minValue(0)),
});
