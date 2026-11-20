/**
 * @file Pollutant Reference Data
 * @description Health thresholds, descriptions, and impact data for major urban pollutants.
 * @module server/domains/aqi/pollutantData
 */

/** Represents a single pollutant's reference information. */
export interface PollutantInfo {
  /** Chemical symbol or abbreviation. */
  id: string;
  /** Full pollutant name. */
  name: string;
  /** Measurement unit. */
  unit: string;
  /** Health effects description. */
  healthImpact: string;
  /** Common sources in urban environments. */
  sources: string[];
  /** WHO guideline threshold. */
  whoGuideline: number;
  /** Breakpoints for AQI categories: [Good, Moderate, UnhealthySensitive, Unhealthy, VeryUnhealthy, Hazardous]. */
  breakpoints: number[];
}

/** Master catalog of tracked urban air pollutants. */
export const POLLUTANT_CATALOG: PollutantInfo[] = [
  {
    id: 'pm25',
    name: 'PM2.5 (Fine Particulate)',
    unit: 'µg/m³',
    healthImpact:
      'Penetrates deep into lungs and bloodstream. Linked to respiratory disease, heart attacks, and premature death.',
    sources: ['Vehicle exhaust', 'Industrial emissions', 'Crop burning', 'Construction dust'],
    whoGuideline: 15,
    breakpoints: [12, 35.4, 55.4, 150.4, 250.4, 500],
  },
  {
    id: 'pm10',
    name: 'PM10 (Coarse Particulate)',
    unit: 'µg/m³',
    healthImpact:
      'Irritates airways, aggravates asthma, and reduces lung function. Especially harmful for children and elderly.',
    sources: ['Road dust', 'Construction', 'Pollen', 'Industrial processes'],
    whoGuideline: 45,
    breakpoints: [54, 154, 254, 354, 424, 604],
  },
  {
    id: 'no2',
    name: 'Nitrogen Dioxide (NO₂)',
    unit: 'ppb',
    healthImpact:
      'Inflames airways, worsens bronchitis and asthma. Long-term exposure reduces lung development in children.',
    sources: ['Vehicle engines', 'Power plants', 'Industrial boilers', 'Gas stoves'],
    whoGuideline: 25,
    breakpoints: [53, 100, 360, 649, 1249, 2049],
  },
  {
    id: 'o3',
    name: 'Ground-Level Ozone (O₃)',
    unit: 'ppb',
    healthImpact:
      'Triggers chest pain, coughing, and throat irritation. Worsens asthma and reduces lung function.',
    sources: ['Formed by sunlight reacting with vehicle/industrial emissions'],
    whoGuideline: 100,
    breakpoints: [54, 70, 85, 105, 200, 604],
  },
  {
    id: 'so2',
    name: 'Sulfur Dioxide (SO₂)',
    unit: 'ppb',
    healthImpact:
      'Causes breathing difficulty, bronchoconstriction, and aggravates existing heart and lung diseases.',
    sources: ['Coal-burning power plants', 'Petroleum refining', 'Metal smelting'],
    whoGuideline: 40,
    breakpoints: [35, 75, 185, 304, 604, 1004],
  },
  {
    id: 'co',
    name: 'Carbon Monoxide (CO)',
    unit: 'ppm',
    healthImpact:
      'Reduces oxygen delivery to organs. At high levels causes dizziness, confusion, and can be fatal.',
    sources: ['Vehicle exhaust', 'Gas heaters', 'Generators', 'Tobacco smoke'],
    whoGuideline: 4,
    breakpoints: [4.4, 9.4, 12.4, 15.4, 30.4, 50.4],
  },
];

/**
 * Retrieves pollutant info by its identifier.
 * @param id - Pollutant identifier (e.g., 'pm25', 'no2').
 * @returns The matching PollutantInfo or undefined.
 */
export function getPollutantById(id: string): PollutantInfo | undefined {
  return POLLUTANT_CATALOG.find((p) => p.id === id);
}
