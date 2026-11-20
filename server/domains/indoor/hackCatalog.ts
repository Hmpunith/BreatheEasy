/**
 * @file Indoor Air Quality Hack Catalog
 * @description Curated database of practical indoor air hacks, costs, and effectiveness ratings.
 * @module server/domains/indoor/hackCatalog
 */

/** Category of indoor air improvement technique. */
export type HackCategory = 'filtration' | 'plants' | 'ventilation' | 'source_control' | 'diy';

/** Detailed indoor air quality hack entry. */
export interface IndoorHack {
  /** Unique identifier. */
  id: string;
  /** Title of the hack. */
  title: string;
  /** Category grouping. */
  category: HackCategory;
  /** Estimated PM2.5 / VOC reduction percentage. */
  effectivenessPercent: number;
  /** Relative implementation cost. */
  costTier: 'free' | 'low' | 'moderate' | 'investment';
  /** Effort required to set up and maintain. */
  effortLevel: 'easy' | 'moderate' | 'advanced';
  /** Step-by-step instructions. */
  instructions: string;
  /** Direct impact explanation for the household. */
  impactRationale: string;
  /** Safety or operational warnings. */
  safetyNotice?: string;
}

/** Master catalog of indoor air hacks. */
export const INDOOR_HACKS: IndoorHack[] = [
  {
    id: 'diy_corsi_box',
    title: 'Corsi-Rosenthal Box (DIY Air Cleaner)',
    category: 'diy',
    effectivenessPercent: 85,
    costTier: 'low',
    effortLevel: 'moderate',
    instructions:
      'Tape 4 MERV-13 furnace filters into a cube with a 20-inch box fan on top blowing upward. Seal all edges with duct tape.',
    impactRationale:
      'Provides high Clean Air Delivery Rate (CADR) equivalent to $500 commercial HEPA units at 15% of the cost.',
    safetyNotice: 'Ensure fan motor is rated for continuous operation and not obstructed.',
  },
  {
    id: 'wet_mop_protocol',
    title: 'Microfiber Wet Mopping & Damp Dusting',
    category: 'source_control',
    effectivenessPercent: 40,
    costTier: 'free',
    effortLevel: 'easy',
    instructions:
      'Mop hard floors and wipe surfaces daily using damp microfiber cloths. Avoid dry brooms and feather dusters.',
    impactRationale:
      'Dry sweeping aerosolizes settled PM2.5 and lead dust into breathable air; damp wiping traps particulates permanently.',
  },
  {
    id: 'window_weatherstrip_seal',
    title: 'Silicone Weatherstripping & Door Draft Stops',
    category: 'filtration',
    effectivenessPercent: 65,
    costTier: 'low',
    effortLevel: 'easy',
    instructions:
      'Apply self-adhesive V-strip silicone seals around window frames and place fabric draft stoppers under entry doors.',
    impactRationale:
      'Stops up to 70% of outdoor winter smog infiltration without running costly continuous heating.',
  },
  {
    id: 'snake_plant_spider_synergy',
    title: 'Air-Purifying Botanical Biofilter Zone',
    category: 'plants',
    effectivenessPercent: 25,
    costTier: 'low',
    effortLevel: 'easy',
    instructions:
      'Group 3–4 Snake Plants (Sansevieria) and Spider Plants in bedrooms and living rooms in well-lit spots.',
    impactRationale:
      'Assists in nighttime CO₂ absorption and trace formaldehyde reduction while elevating indoor humidity naturally.',
    safetyNotice: 'Keep plants out of reach of pets if varieties have toxic leaves.',
  },
  {
    id: 'kitchen_cross_vent_timing',
    title: 'Cooking Exhaust Timing Protocol',
    category: 'ventilation',
    effectivenessPercent: 75,
    costTier: 'free',
    effortLevel: 'easy',
    instructions:
      'Turn kitchen exhaust fans on high 2 minutes BEFORE lighting the stove and keep running 10 minutes after cooking.',
    impactRationale:
      'Prevents nitrogen dioxide (NO₂) and ultrafine oil droplets from diffusing through hallways and bedrooms.',
  },
  {
    id: 'activated_carbon_canisters',
    title: 'Granular Activated Carbon VOC Adsorption',
    category: 'filtration',
    effectivenessPercent: 80,
    costTier: 'moderate',
    effortLevel: 'moderate',
    instructions:
      'Place refillable activated charcoal filters near shoe racks, kitchens, and freshly painted or renovated rooms.',
    impactRationale:
      'Removes gaseous benzene, toluene, and winter heating odors that standard mechanical HEPA fibers cannot catch.',
  },
];

/**
 * Filter hacks by category or maximum cost tier.
 * @param category - Optional category filter.
 * @returns Filtered array of indoor hacks.
 */
export function queryIndoorHacks(category?: HackCategory): IndoorHack[] {
  if (!category) {
    return [...INDOOR_HACKS];
  }
  return INDOOR_HACKS.filter((hack) => hack.category === category);
}
