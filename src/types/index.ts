/**
 * @file Client Data Models and Type Definitions
 * @description Master TypeScript contracts for BreatheEasy UI state and API exchange.
 * @module src/types
 */

/** Available tab views in the application navigation. */
export type ActiveTab =
  | 'dashboard'
  | 'copilot'
  | 'routine'
  | 'indoor'
  | 'alternatives'
  | 'impact'
  | 'profile';

/** Air quality severity classification label. */
export type AqiSeverity =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

/** AQI assessment outcome. */
export interface AqiAssessment {
  aqi: number;
  severity: AqiSeverity;
  color: string;
  advisory: string;
  outdoorAdvice: string;
  maskAdvice: string;
}

/** Individual pollutant metric. */
export interface PollutantDetail {
  id: string;
  name: string;
  unit: string;
  healthImpact: string;
  sources: string[];
  whoGuideline: number;
  currentValue?: number;
}

/** Family profile configuration for health and demographic context. */
export interface FamilyProfile {
  memberCount: number;
  hasChildren: boolean;
  hasElderly: boolean;
  hasRespiratoryConditions: boolean;
  location: string;
}

/** Household layout and physical setting. */
export interface HomeProfile {
  homeType: 'apartment' | 'detached' | 'compact_studio';
  budget: 'free_only' | 'low_cost' | 'open';
  hasIndoorCombustion: boolean;
  hasPets: boolean;
}

/** Routine activity item. */
export interface RoutineActivity {
  timeSlot: string;
  activity: string;
  location: 'indoor' | 'outdoor' | 'either';
  emissionCategory: 'low' | 'moderate' | 'high';
  greenTip: string;
}

/** Complete daily routine plan. */
export interface DailyRoutine {
  aqi: number;
  profile: FamilyProfile;
  activities: RoutineActivity[];
  warnings: string[];
  estimatedSavingsKg: number;
}

/** Indoor hack entry. */
export interface IndoorHack {
  id: string;
  title: string;
  category: 'filtration' | 'plants' | 'ventilation' | 'source_control' | 'diy';
  effectivenessPercent: number;
  costTier: 'free' | 'low' | 'moderate' | 'investment';
  effortLevel: 'easy' | 'moderate' | 'advanced';
  instructions: string;
  impactRationale: string;
  safetyNotice?: string;
}

/** Recommended hack with ranking score. */
export interface RankedHack {
  hack: IndoorHack;
  score: number;
  personalFitReason: string;
}

/** Sustainable alternative record. */
export interface SustainableAlternative {
  id: string;
  title: string;
  category: 'commute' | 'home_heating' | 'food_energy' | 'community_action';
  replacesConventional: string;
  co2eReductionPercent: number;
  smogReductionPercent: number;
  financialPayoff: 'saves_money' | 'neutral' | 'modest_investment';
  implementationSteps: string[];
  communityBenefit: string;
}

/** Impact report result from calculator. */
export interface ImpactReport {
  baselineCo2eKg: number;
  alternativeCo2eKg: number;
  netCo2eSavedKg: number;
  baselinePm25Grams: number;
  alternativePm25Grams: number;
  netPm25ReducedGrams: number;
  treeSeedlingsEquivalent: number;
  executiveSummary: string;
}

/** Chat message entry in Copilot history. */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'cache' | 'fallback';
}
