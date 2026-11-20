/**
 * @file Emission and Health Impact Calculator
 * @description Computes emission savings, particulate reductions, and tree equivalencies.
 * @module server/domains/impact/calculator
 */

import { getFactor } from './emissionFactors.js';

/** Input parameters for comparing a current routine against a sustainable alternative. */
export interface ImpactComparisonRequest {
  /** Baseline activity factor key. */
  baselineActivityId: string;
  /** Sustainable replacement factor key. */
  alternativeActivityId: string;
  /** Activity volume (e.g., km travelled or hours heated). */
  volume: number;
  /** Frequency multiplier (days per month or year). */
  frequencyMultiplier: number;
}

/** Detailed impact comparison output. */
export interface ImpactReport {
  /** Total baseline CO2e in kg. */
  baselineCo2eKg: number;
  /** Total alternative CO2e in kg. */
  alternativeCo2eKg: number;
  /** Net CO2e saved in kg. */
  netCo2eSavedKg: number;
  /** Total baseline PM2.5 in grams. */
  baselinePm25Grams: number;
  /** Total alternative PM2.5 in grams. */
  alternativePm25Grams: number;
  /** Net PM2.5 reduced in grams. */
  netPm25ReducedGrams: number;
  /** Tree seedlings grown for 10 years equivalent (1 tree ≈ 21 kg CO2/yr). */
  treeSeedlingsEquivalent: number;
  /** Clear language summary of the impact. */
  executiveSummary: string;
}

/**
 * Calculates environmental and particulate delta between baseline and green alternative.
 * @param req - Input containing baseline, alternative, and volume.
 * @returns Quantitative impact report with human-readable rationale.
 * @throws {Error} When volume or frequency multiplier is non-positive.
 */
export function calculateImpact(req: ImpactComparisonRequest): ImpactReport {
  if (req.volume <= 0 || req.frequencyMultiplier <= 0) {
    throw new Error('Volume and frequency multiplier must be positive numbers.');
  }

  const baseFactor = getFactor(req.baselineActivityId);
  const altFactor = getFactor(req.alternativeActivityId);

  const totalUnits = req.volume * req.frequencyMultiplier;

  const baselineCo2eKg = totalUnits * baseFactor.co2eKgPerUnit;
  const alternativeCo2eKg = totalUnits * altFactor.co2eKgPerUnit;
  const netCo2eSavedKg = Math.max(0, baselineCo2eKg - alternativeCo2eKg);

  const baselinePm25Grams = totalUnits * baseFactor.pm25GramsPerUnit;
  const alternativePm25Grams = totalUnits * altFactor.pm25GramsPerUnit;
  const netPm25ReducedGrams = Math.max(0, baselinePm25Grams - alternativePm25Grams);

  // 1 urban tree absorbs approximately 21 kg CO2 annually (~1.75 kg/month)
  const treeSeedlingsEquivalent = Math.round((netCo2eSavedKg / 21) * 10) / 10;

  const summary = `Switching from ${baseFactor.name} to ${altFactor.name} saves ${netCo2eSavedKg.toFixed(1)} kg CO₂e and eliminates ${netPm25ReducedGrams.toFixed(1)}g of direct PM2.5 pollution over ${req.frequencyMultiplier} intervals.`;

  return {
    baselineCo2eKg: Math.round(baselineCo2eKg * 100) / 100,
    alternativeCo2eKg: Math.round(alternativeCo2eKg * 100) / 100,
    netCo2eSavedKg: Math.round(netCo2eSavedKg * 100) / 100,
    baselinePm25Grams: Math.round(baselinePm25Grams * 100) / 100,
    alternativePm25Grams: Math.round(alternativePm25Grams * 100) / 100,
    netPm25ReducedGrams: Math.round(netPm25ReducedGrams * 100) / 100,
    treeSeedlingsEquivalent,
    executiveSummary: summary,
  };
}
