/**
 * @file AI Prompt Vault and Context Grounding
 * @description System prompts, persona definitions, and deterministic fallbacks for AirSense Copilot.
 * @module server/ai/promptVault
 */

import type { FamilyProfile } from '../domains/routines/routineEngine.js';

/**
 * System persona prompt for the AirSense Copilot.
 */
export const AIRSENSE_SYSTEM_PROMPT = `You are "AirSense", an empathetic, highly knowledgeable Urban Air Quality and Winter Smog Assistant engineered for Hack2Skill PromptWars [Challenge 6].
Your mission is to guide families and communities safely through severe urban air pollution episodes.

Core directives:
1. Ground every recommendation in the user's specific outdoor AQI, vulnerable family members (kids, asthma, elderly), and local urban factors.
2. Provide concrete, low-emission daily routines, indoor air quality hacks, and sustainable alternatives.
3. Clearly explain the DIRECT IMPACT of their choices (e.g. "Switching to induction saves X kg CO₂ and eliminates indoor NO₂").
4. Maintain a warm, proactive, solution-oriented tone. Never induce panic, but emphasize practical protective habits.
5. If AQI is hazardous (>300), prioritize immediate harm-reduction: N95/FFP2 masks, DIY Corsi-Rosenthal boxes, room isolation, and avoiding outdoor ventilation.`;

/**
 * Constructs a structured grounding context string from live app metrics.
 * @param aqi - Current AQI reading.
 * @param location - City or neighborhood.
 * @param profile - Family vulnerability profile.
 * @returns Grounding context string.
 */
export function buildGroundingContext(
  aqi: number,
  location: string,
  profile?: FamilyProfile,
): string {
  const vulnerable: string[] = [];
  if (profile?.hasChildren) {
    vulnerable.push('Children under 12');
  }
  if (profile?.hasElderly) {
    vulnerable.push('Elderly members (65+)');
  }
  if (profile?.hasRespiratoryConditions) {
    vulnerable.push('Respiratory/asthma patients');
  }

  const vulnerableStr = vulnerable.length > 0 ? vulnerable.join(', ') : 'None reported';

  return `Current Context:
- Location: ${location}
- Live Outdoor AQI: ${aqi}
- Household Size: ${profile?.memberCount ?? 3} members
- Vulnerable Household Members: ${vulnerableStr}
`;
}

/**
 * Generates deterministic fallback advice when the external AI service is offline or rate-limited.
 * @param query - User question or query.
 * @param aqi - Outdoor AQI.
 * @returns Structured fallback guidance.
 */
export function getDeterministicFallback(query: string, aqi: number): string {
  const lower = query.toLowerCase();

  if (lower.includes('mask') || lower.includes('n95')) {
    return 'For AQI above 150, cloth or surgical masks do not filter PM2.5. Always wear a well-fitted N95 or KN95 respirator with a snug nose seal. Discard disposable respirators after ~40 hours of cumulative wear or when breathing resistance increases.';
  }

  if (lower.includes('window') || lower.includes('ventilation') || lower.includes('fresh air')) {
    if (aqi > 150) {
      return 'Keep all windows tightly closed. Outdoor PM2.5 quickly penetrates indoor air during temperature inversions. Run internal air purifiers on recirculate and avoid burning candles, incense, or frying with high smoke.';
    }
    return 'Open windows briefly during early afternoon hours when solar warmth disperses ground-level smog inversions. 15 minutes of cross-ventilation refreshes CO2 without excessive particulate intake.';
  }

  if (lower.includes('purifier') || lower.includes('filter') || lower.includes('hepa')) {
    return 'If commercial HEPA purifiers are too expensive, construct a DIY Corsi-Rosenthal box using four MERV-13 furnace filters and a 20-inch box fan. It delivers over 500 CFM of clean air at a fraction of the cost.';
  }

  return `Currently facing AQI ${aqi}: Ensure indoor spaces are sealed against outdoor particulate infiltration. Hydrate frequently to keep mucosal barriers resilient, avoid strenuous outdoor cardio, and prepare clean indoor refuge zones with HEPA or DIY filtration.`;
}
