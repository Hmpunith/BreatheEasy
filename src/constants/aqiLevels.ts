/**
 * @file AQI Levels and Visual Scale Constants
 * @description Standard color mappings, thresholds, and health classifications.
 * @module src/constants/aqiLevels
 */

import type { AqiSeverity } from '../types';

export interface AqiScaleBand {
  min: number;
  max: number;
  severity: AqiSeverity;
  color: string;
  badgeBg: string;
}

export const AQI_SCALE_BANDS: AqiScaleBand[] = [
  { min: 0, max: 50, severity: 'Good', color: '#22c55e', badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { min: 51, max: 100, severity: 'Moderate', color: '#eab308', badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { min: 101, max: 150, severity: 'Unhealthy for Sensitive Groups', color: '#f97316', badgeBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  { min: 151, max: 200, severity: 'Unhealthy', color: '#ef4444', badgeBg: 'bg-red-500/15 text-red-400 border-red-500/30' },
  { min: 201, max: 300, severity: 'Very Unhealthy', color: '#a855f7', badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { min: 301, max: 500, severity: 'Hazardous', color: '#991b1b', badgeBg: 'bg-rose-950/40 text-rose-400 border-rose-800/50' },
];

/** Presets of urban cities known for seasonal winter smog. */
export const MONITORED_CITIES = [
  { name: 'New Delhi, India', defaultAqi: 285, region: 'South Asia' },
  { name: 'Lahore, Pakistan', defaultAqi: 310, region: 'South Asia' },
  { name: 'Beijing, China', defaultAqi: 125, region: 'East Asia' },
  { name: 'London, United Kingdom', defaultAqi: 42, region: 'Europe' },
  { name: 'Los Angeles, USA', defaultAqi: 78, region: 'North America' },
];
