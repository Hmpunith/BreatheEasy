/**
 * @file Emission Factors and Environmental Conversion Factors
 * @description Standardized carbon intensity and particulate emission factors for urban activities.
 * @module server/domains/impact/emissionFactors
 */

/** Emission factor record containing both greenhouse gas and particulate metrics. */
export interface EmissionFactor {
  /** Activity key identifier. */
  id: string;
  /** Activity label. */
  name: string;
  /** Activity domain. */
  domain: 'transport' | 'heating' | 'cooking';
  /** Unit of measurement. */
  unit: string;
  /** Kilograms of CO2-equivalent per unit. */
  co2eKgPerUnit: number;
  /** Grams of PM2.5 emitted per unit. */
  pm25GramsPerUnit: number;
}

/** Master catalog of urban activity emission factors. */
export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // Transport (per passenger km)
  car_ice_gasoline: {
    id: 'car_ice_gasoline',
    name: 'Single-Occupancy Petrol Car',
    domain: 'transport',
    unit: 'km',
    co2eKgPerUnit: 0.192,
    pm25GramsPerUnit: 0.045,
  },
  car_diesel: {
    id: 'car_diesel',
    name: 'Single-Occupancy Diesel Car',
    domain: 'transport',
    unit: 'km',
    co2eKgPerUnit: 0.171,
    pm25GramsPerUnit: 0.082,
  },
  electric_car: {
    id: 'electric_car',
    name: 'Battery Electric Vehicle (Grid Avg)',
    domain: 'transport',
    unit: 'km',
    co2eKgPerUnit: 0.053,
    pm25GramsPerUnit: 0.012, // Brake and tire wear only
  },
  metro_electric: {
    id: 'metro_electric',
    name: 'Subway / Metro Rail',
    domain: 'transport',
    unit: 'km',
    co2eKgPerUnit: 0.028,
    pm25GramsPerUnit: 0.003,
  },
  active_cycling_walk: {
    id: 'active_cycling_walk',
    name: 'Bicycle or Walking',
    domain: 'transport',
    unit: 'km',
    co2eKgPerUnit: 0.0,
    pm25GramsPerUnit: 0.0,
  },

  // Heating (per hour of active winter heating)
  wood_stove_fireplace: {
    id: 'wood_stove_fireplace',
    name: 'Traditional Wood Fireplace / Stove',
    domain: 'heating',
    unit: 'hour',
    co2eKgPerUnit: 3.85,
    pm25GramsPerUnit: 18.2,
  },
  natural_gas_boiler: {
    id: 'natural_gas_boiler',
    name: 'Natural Gas Furnace / Boiler',
    domain: 'heating',
    unit: 'hour',
    co2eKgPerUnit: 1.45,
    pm25GramsPerUnit: 0.08,
  },
  heat_pump_electric: {
    id: 'heat_pump_electric',
    name: 'Air-Source Heat Pump',
    domain: 'heating',
    unit: 'hour',
    co2eKgPerUnit: 0.42,
    pm25GramsPerUnit: 0.0,
  },

  // Cooking (per meal prepared)
  gas_stove_meal: {
    id: 'gas_stove_meal',
    name: 'Gas Stove Cooking',
    domain: 'cooking',
    unit: 'meal',
    co2eKgPerUnit: 0.48,
    pm25GramsPerUnit: 1.15,
  },
  induction_cooktop_meal: {
    id: 'induction_cooktop_meal',
    name: 'Electric Induction Cooktop',
    domain: 'cooking',
    unit: 'meal',
    co2eKgPerUnit: 0.16,
    pm25GramsPerUnit: 0.05,
  },
};

/**
 * Retrieves factor by ID.
 * @param id - Factor identifier.
 * @returns EmissionFactor or throws if invalid.
 */
export function getFactor(id: string): EmissionFactor {
  const factor = EMISSION_FACTORS[id];
  if (!factor) {
    throw new Error(`Emission factor '${id}' does not exist.`);
  }
  return factor;
}
