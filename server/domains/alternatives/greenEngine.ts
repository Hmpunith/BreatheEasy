/**
 * @file Sustainable Alternatives Matcher Engine
 * @description Tailors green lifestyle alternatives to user priority, lifestyle, and city location.
 * @module server/domains/alternatives/greenEngine
 */

import {
  SUSTAINABLE_ALTERNATIVES,
  type SustainableAlternative,
  type AlternativeCategory,
} from './alternativeCatalog.js';

/** User lifestyle goals for green alternative matching. */
export interface LifestyleGoals {
  /** Primary motivation. */
  primaryFocus: 'health_first' | 'cost_savings' | 'community_impact' | 'maximum_clean_air';
  /** Urban setting. */
  density: 'dense_metro' | 'suburban' | 'regional_town';
  /** Daily commute distance in kilometers. */
  commuteKm: number;
}

/** Ranked alternative recommendation. */
export interface TailoredAlternative {
  /** Alternative entity. */
  alternative: SustainableAlternative;
  /** Suitability match score (0–100). */
  matchScore: number;
  /** Actionable reason tailored to the user profile. */
  tailoredReason: string;
}

/**
 * Ranks sustainable alternatives against user lifestyle preferences and geographic context.
 * @param goals - User priorities and lifestyle metrics.
 * @returns Sorted list of tailored alternatives.
 */
export function matchSustainableAlternatives(goals: LifestyleGoals): TailoredAlternative[] {
  const scored: TailoredAlternative[] = SUSTAINABLE_ALTERNATIVES.map((alt) => {
    let score = (alt.co2eReductionPercent + alt.smogReductionPercent) / 2;
    let reason = 'High overall pollution reduction impact.';

    if (goals.primaryFocus === 'cost_savings' && alt.financialPayoff === 'saves_money') {
      score += 20;
      reason = 'Significant monthly financial savings while lowering emissions.';
    }

    if (goals.primaryFocus === 'health_first' && alt.smogReductionPercent >= 90) {
      score += 25;
      reason = 'Maximum reduction in direct respiratory and lung-irritating smog.';
    }

    if (goals.primaryFocus === 'community_impact' && alt.category === 'community_action') {
      score += 30;
      reason = 'Empowers neighborhood collective action to stop local smoke sources.';
    }

    if (goals.commuteKm > 10 && alt.category === 'commute') {
      score += 15;
      reason = `Substantial reduction for your ${goals.commuteKm} km daily commute.`;
    }

    return {
      alternative: alt,
      matchScore: Math.min(100, Math.round(score)),
      tailoredReason: reason,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Returns available alternative categories.
 * @returns Array of unique alternative category strings.
 */
export function getAlternativeCategories(): AlternativeCategory[] {
  return ['commute', 'home_heating', 'food_energy', 'community_action'];
}
