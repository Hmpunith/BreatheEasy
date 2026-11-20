/**
 * @file Routine Generation Engine
 * @description Generates personalized daily routines based on AQI and family profile.
 * @module server/domains/routines/routineEngine
 */

import { getRoutinesByAqi, type RoutineActivity } from './routineTemplates.js';

/** Family profile for personalization. */
export interface FamilyProfile {
  /** Number of family members. */
  memberCount: number;
  /** Whether the family includes children under 12. */
  hasChildren: boolean;
  /** Whether the family includes elderly members (65+). */
  hasElderly: boolean;
  /** Whether any member has respiratory conditions. */
  hasRespiratoryConditions: boolean;
  /** City or locality name. */
  location: string;
}

/** Generated daily routine output. */
export interface DailyRoutine {
  /** Current AQI the routine is based on. */
  aqi: number;
  /** Family profile used for personalization. */
  profile: FamilyProfile;
  /** List of time-slotted activities. */
  activities: RoutineActivity[];
  /** Personalized warnings based on profile vulnerabilities. */
  warnings: string[];
  /** Estimated daily emission savings compared to typical urban behavior (kg CO₂e). */
  estimatedSavingsKg: number;
}

/**
 * Generates a personalized daily routine based on current AQI and family profile.
 * @param aqi - Current Air Quality Index value.
 * @param profile - Family demographic and health profile.
 * @returns A complete daily routine with warnings and estimated savings.
 */
export function generateDailyRoutine(aqi: number, profile: FamilyProfile): DailyRoutine {
  const activities = getRoutinesByAqi(aqi);
  const warnings = buildWarnings(aqi, profile);
  const estimatedSavingsKg = calculateRoutineSavings(activities);

  return {
    aqi,
    profile,
    activities,
    warnings,
    estimatedSavingsKg: Math.round(estimatedSavingsKg * 100) / 100,
  };
}

/**
 * Builds personalized warnings based on family vulnerabilities and AQI.
 * @param aqi - Current AQI value.
 * @param profile - Family profile.
 * @returns Array of warning messages.
 */
function buildWarnings(aqi: number, profile: FamilyProfile): string[] {
  const warnings: string[] = [];

  if (profile.hasChildren && aqi > 100) {
    warnings.push(
      '⚠️ Children under 12 are especially vulnerable. Keep them indoors and use HEPA air purifiers.',
    );
  }
  if (profile.hasElderly && aqi > 100) {
    warnings.push(
      '⚠️ Elderly family members should avoid all outdoor exertion. Monitor for breathing difficulty.',
    );
  }
  if (profile.hasRespiratoryConditions && aqi > 50) {
    warnings.push(
      '⚠️ Family members with respiratory conditions should use prescribed inhalers preventively.',
    );
  }
  if (aqi > 200) {
    warnings.push(
      '🚨 SEVERE: AQI exceeds 200. All family members should remain indoors with sealed windows.',
    );
  }
  if (aqi > 300) {
    warnings.push(
      '🚨 HAZARDOUS: Consider temporary relocation to a cleaner air zone if possible.',
    );
  }

  return warnings;
}

/**
 * Estimates emission savings from following the low-emission routine.
 * @param activities - The planned routine activities.
 * @returns Estimated CO₂e savings in kilograms.
 */
function calculateRoutineSavings(activities: RoutineActivity[]): number {
  let savings = 0;
  for (const activity of activities) {
    if (activity.emissionCategory === 'low') {
      savings += 0.8;
    } else if (activity.emissionCategory === 'moderate') {
      savings += 0.3;
    }
  }
  return savings;
}
