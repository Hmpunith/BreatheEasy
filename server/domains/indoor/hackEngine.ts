/**
 * @file Indoor Air Quality Hack Recommendation Engine
 * @description Ranks and scores indoor air quality hacks based on home profile and smog severity.
 * @module server/domains/indoor/hackEngine
 */

import { INDOOR_HACKS, type IndoorHack, type HackCategory } from './hackCatalog.js';

/** Home layout and preference profile. */
export interface HomeProfile {
  /** Square footage or room count. */
  homeType: 'apartment' | 'detached' | 'compact_studio';
  /** Budget constraint. */
  budget: 'free_only' | 'low_cost' | 'open';
  /** Whether anyone smokes or cooks frequently with high heat. */
  hasIndoorCombustion: boolean;
  /** Presence of pets. */
  hasPets: boolean;
}

/** Ranked hack recommendation with calculated relevance score. */
export interface RankedHack {
  /** The hack entity. */
  hack: IndoorHack;
  /** Score from 0 to 100 based on situational fit. */
  score: number;
  /** Reason why this hack was recommended for this specific home. */
  personalFitReason: string;
}

/**
 * Recommends and prioritizes indoor air hacks tailored to home profile and outdoor AQI.
 * @param aqi - Outdoor AQI severity level.
 * @param profile - Details regarding the living space.
 * @returns Ranked array of recommended hacks sorted by relevance.
 */
export function recommendIndoorHacks(aqi: number, profile: HomeProfile): RankedHack[] {
  const ranked: RankedHack[] = INDOOR_HACKS.map((hack) => {
    let score = hack.effectivenessPercent;
    let reason = 'High general particulate filtration capability.';

    if (profile.budget === 'free_only' && hack.costTier !== 'free') {
      score = 0;
      reason = 'Filtered out due to strict zero-budget preference.';
    } else if (profile.budget === 'low_cost' && hack.costTier === 'investment') {
      score -= 40;
      reason = 'Higher capital expenditure required.';
    }

    if (aqi >= 200 && (hack.id === 'diy_corsi_box' || hack.id === 'window_weatherstrip_seal')) {
      score += 25;
      reason = 'Crucial emergency defense for severe winter smog episodes.';
    }

    if (profile.hasIndoorCombustion && hack.category === 'ventilation') {
      score += 20;
      reason = 'Targeted mitigation for indoor combustion-generated NO2 and particulates.';
    }

    if (profile.hasPets && hack.id === 'wet_mop_protocol') {
      score += 15;
      reason = 'Traps dander and tracked-in street dust before recirculation.';
    }

    return {
      hack,
      score: Math.min(100, Math.max(0, score)),
      personalFitReason: reason,
    };
  });

  return ranked
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Returns available categories for UI filtering.
 * @returns Array of unique hack category strings.
 */
export function getHackCategories(): HackCategory[] {
  return ['filtration', 'plants', 'ventilation', 'source_control', 'diy'];
}
