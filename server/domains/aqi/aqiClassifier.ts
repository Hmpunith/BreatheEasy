/**
 * @file AQI Classifier Engine
 * @description Classifies Air Quality Index values into severity levels with health advisories.
 * @module server/domains/aqi/aqiClassifier
 */

/** Severity levels for AQI classification. */
export type AqiSeverity =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

/** Result of an AQI classification operation. */
export interface AqiClassification {
  /** Numeric AQI value. */
  aqi: number;
  /** Severity category label. */
  severity: AqiSeverity;
  /** Color code for UI display (hex). */
  color: string;
  /** Health advisory message. */
  advisory: string;
  /** Recommended outdoor activity level. */
  outdoorAdvice: string;
  /** Recommended mask type, if any. */
  maskAdvice: string;
}

interface SeverityBand {
  max: number;
  severity: AqiSeverity;
  color: string;
  advisory: string;
  outdoorAdvice: string;
  maskAdvice: string;
}

const SEVERITY_BANDS: SeverityBand[] = [
  {
    max: 50,
    severity: 'Good',
    color: '#22c55e',
    advisory: 'Air quality is satisfactory. Enjoy outdoor activities freely.',
    outdoorAdvice: 'All outdoor activities are safe for everyone.',
    maskAdvice: 'No mask needed.',
  },
  {
    max: 100,
    severity: 'Moderate',
    color: '#eab308',
    advisory: 'Acceptable air quality. Unusually sensitive individuals should limit prolonged outdoor exertion.',
    outdoorAdvice: 'Most people can be active outdoors. Sensitive groups should take breaks.',
    maskAdvice: 'Optional for sensitive individuals.',
  },
  {
    max: 150,
    severity: 'Unhealthy for Sensitive Groups',
    color: '#f97316',
    advisory: 'Children, elderly, and those with respiratory conditions should reduce outdoor exertion.',
    outdoorAdvice: 'Sensitive groups should limit outdoor exercise. Others can be active with caution.',
    maskAdvice: 'N95 mask recommended for sensitive groups outdoors.',
  },
  {
    max: 200,
    severity: 'Unhealthy',
    color: '#ef4444',
    advisory: 'Everyone may begin to experience health effects. Sensitive groups face serious risk.',
    outdoorAdvice: 'Reduce prolonged outdoor exertion. Move activities indoors when possible.',
    maskAdvice: 'N95 mask strongly recommended for all outdoor activity.',
  },
  {
    max: 300,
    severity: 'Very Unhealthy',
    color: '#a855f7',
    advisory: 'Health alert: significant risk of health effects for everyone.',
    outdoorAdvice: 'Avoid all outdoor physical activities. Stay indoors with air filtration.',
    maskAdvice: 'N95/KN95 mask required for any outdoor exposure.',
  },
  {
    max: Infinity,
    severity: 'Hazardous',
    color: '#991b1b',
    advisory: 'Health emergency: entire population at severe risk. Avoid all outdoor exposure.',
    outdoorAdvice: 'Do not go outdoors. Seal windows and run air purifiers at maximum.',
    maskAdvice: 'N99/P100 respirator required. Avoid any outdoor exposure.',
  },
];

/**
 * Classifies a numeric AQI value into a severity category with health advisory.
 * @param aqi - The Air Quality Index value (0–500+).
 * @returns The classification result with severity, advisory, and recommendations.
 * @throws {Error} When the AQI value is negative.
 */
export function classifyAqi(aqi: number): AqiClassification {
  if (aqi < 0) {
    throw new Error('AQI value cannot be negative.');
  }

  const band = SEVERITY_BANDS.find((b) => aqi <= b.max);
  if (!band) {
    throw new Error(`No severity band found for AQI ${aqi}.`);
  }

  return {
    aqi,
    severity: band.severity,
    color: band.color,
    advisory: band.advisory,
    outdoorAdvice: band.outdoorAdvice,
    maskAdvice: band.maskAdvice,
  };
}

/**
 * Returns all defined severity bands for reference.
 * @returns Array of severity threshold definitions.
 */
export function getSeverityBands(): SeverityBand[] {
  return [...SEVERITY_BANDS];
}
