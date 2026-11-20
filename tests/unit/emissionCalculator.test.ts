/**
 * @file Emission and Particulate Impact Calculator Unit Tests
 * @description Verifies carbon savings, direct PM2.5 reduction, and tree offset equivalents.
 */

import { describe, it, expect } from 'vitest';
import { calculateImpact } from '../../server/domains/impact/calculator';
import { getFactor } from '../../server/domains/impact/emissionFactors';

describe('Emission Impact Calculator Tests', () => {
  it('correctly calculates savings when switching from petrol car to metro', () => {
    const report = calculateImpact({
      baselineActivityId: 'car_ice_gasoline',
      alternativeActivityId: 'metro_electric',
      volume: 20, // 20 km
      frequencyMultiplier: 20, // 20 days
    });

    expect(report.baselineCo2eKg).toBeGreaterThan(report.alternativeCo2eKg);
    expect(report.netCo2eSavedKg).toBeCloseTo(65.6, 1);
    expect(report.netPm25ReducedGrams).toBeGreaterThan(0);
    expect(report.treeSeedlingsEquivalent).toBeGreaterThan(0);
    expect(report.executiveSummary).toContain('Subway / Metro Rail');
  });

  it('correctly calculates savings when switching from wood stove to heat pump', () => {
    const report = calculateImpact({
      baselineActivityId: 'wood_stove_fireplace',
      alternativeActivityId: 'heat_pump_electric',
      volume: 4, // 4 hours/day
      frequencyMultiplier: 30, // 30 days
    });

    expect(report.baselinePm25Grams).toBeGreaterThan(2000);
    expect(report.alternativePm25Grams).toBe(0);
    expect(report.netPm25ReducedGrams).toBe(report.baselinePm25Grams);
  });

  it('throws error for non-positive volume or frequency', () => {
    expect(() =>
      calculateImpact({
        baselineActivityId: 'car_ice_gasoline',
        alternativeActivityId: 'metro_electric',
        volume: -5,
        frequencyMultiplier: 10,
      }),
    ).toThrow('Volume and frequency multiplier must be positive numbers.');
  });

  it('throws error for unknown factor id', () => {
    expect(() => getFactor('unknown_factor')).toThrow("Emission factor 'unknown_factor' does not exist.");
  });
});
