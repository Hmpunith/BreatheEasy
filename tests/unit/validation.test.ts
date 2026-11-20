/**
 * @file Valibot Request Validation Schemas Unit Tests
 * @description Verifies schema boundaries, type constraints, and input sanitization rules.
 */

import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import {
  ChatRequestSchema,
  AqiClassifySchema,
  RoutineGenerateSchema,
  HackRecommendSchema,
  ImpactCalculateSchema,
  AlternativesMatchSchema,
} from '../../server/validation/schemas';

describe('Valibot Schema Boundary Validation Tests', () => {
  it('accepts valid chat payload', () => {
    const valid = { prompt: 'How to seal windows?', aqi: 150, location: 'New Delhi' };
    const result = v.safeParse(ChatRequestSchema, valid);
    expect(result.success).toBe(true);
  });

  it('rejects empty chat prompt', () => {
    const invalid = { prompt: '' };
    const result = v.safeParse(ChatRequestSchema, invalid);
    expect(result.success).toBe(false);
  });

  it('rejects negative AQI value in AqiClassifySchema', () => {
    const invalid = { aqi: -10 };
    const result = v.safeParse(AqiClassifySchema, invalid);
    expect(result.success).toBe(false);
  });

  it('accepts valid RoutineGenerateSchema payload', () => {
    const valid = {
      aqi: 220,
      profile: {
        memberCount: 3,
        hasChildren: true,
        hasElderly: false,
        hasRespiratoryConditions: true,
        location: 'London',
      },
    };
    const result = v.safeParse(RoutineGenerateSchema, valid);
    expect(result.success).toBe(true);
  });

  it('rejects zero or negative member count in routine profile', () => {
    const invalid = {
      aqi: 220,
      profile: {
        memberCount: 0,
        hasChildren: true,
        hasElderly: false,
        hasRespiratoryConditions: true,
        location: 'London',
      },
    };
    const result = v.safeParse(RoutineGenerateSchema, invalid);
    expect(result.success).toBe(false);
  });

  it('accepts valid HackRecommendSchema', () => {
    const valid = {
      aqi: 180,
      profile: {
        homeType: 'apartment',
        budget: 'low_cost',
        hasIndoorCombustion: true,
        hasPets: false,
      },
    };
    const result = v.safeParse(HackRecommendSchema, valid);
    expect(result.success).toBe(true);
  });

  it('rejects invalid picklist value in HackRecommendSchema', () => {
    const invalid = {
      aqi: 180,
      profile: {
        homeType: 'spaceship',
        budget: 'low_cost',
        hasIndoorCombustion: true,
        hasPets: false,
      },
    };
    const result = v.safeParse(HackRecommendSchema, invalid);
    expect(result.success).toBe(false);
  });

  it('accepts valid ImpactCalculateSchema', () => {
    const valid = {
      baselineActivityId: 'car_ice_gasoline',
      alternativeActivityId: 'metro_electric',
      volume: 25,
      frequencyMultiplier: 20,
    };
    const result = v.safeParse(ImpactCalculateSchema, valid);
    expect(result.success).toBe(true);
  });

  it('rejects zero or negative volume in ImpactCalculateSchema', () => {
    const invalid = {
      baselineActivityId: 'car_ice_gasoline',
      alternativeActivityId: 'metro_electric',
      volume: 0,
      frequencyMultiplier: 20,
    };
    const result = v.safeParse(ImpactCalculateSchema, invalid);
    expect(result.success).toBe(false);
  });

  it('accepts valid AlternativesMatchSchema', () => {
    const valid = {
      primaryFocus: 'health_first',
      density: 'dense_metro',
      commuteKm: 18,
    };
    const result = v.safeParse(AlternativesMatchSchema, valid);
    expect(result.success).toBe(true);
  });
});
