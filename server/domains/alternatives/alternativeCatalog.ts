/**
 * @file Sustainable Alternatives Catalog
 * @description Catalog of green lifestyle alternatives for winter smog mitigation and long-term sustainability.
 * @module server/domains/alternatives/alternativeCatalog
 */

/** Category of sustainable urban alternative. */
export type AlternativeCategory = 'commute' | 'home_heating' | 'food_energy' | 'community_action';

/** Sustainable alternative record. */
export interface SustainableAlternative {
  /** Unique key. */
  id: string;
  /** Title of the alternative. */
  title: string;
  /** Category grouping. */
  category: AlternativeCategory;
  /** Conventional practice it replaces. */
  replacesConventional: string;
  /** Typical percentage reduction in emissions. */
  co2eReductionPercent: number;
  /** Typical percentage reduction in localized particulate smog. */
  smogReductionPercent: number;
  /** Estimated monthly cost impact (savings or modest expenditure). */
  financialPayoff: 'saves_money' | 'neutral' | 'modest_investment';
  /** Actionable transition steps. */
  implementationSteps: string[];
  /** Systemic community co-benefit. */
  communityBenefit: string;
}

/** Master catalog of sustainable urban alternatives. */
export const SUSTAINABLE_ALTERNATIVES: SustainableAlternative[] = [
  {
    id: 'e_bus_transit_commute',
    title: 'Electric Transit & Rapid Rail Pass',
    category: 'commute',
    replacesConventional: 'Daily single-occupancy petrol vehicle commuting',
    co2eReductionPercent: 78,
    smogReductionPercent: 95,
    financialPayoff: 'saves_money',
    implementationSteps: [
      'Locate nearest metro or express bus feeder route using city transit apps.',
      'Purchase monthly digital transit pass for seamless turnstile tap-in.',
      'Pair first/last mile with a folding bicycle or shared electric kick-scooter.',
    ],
    communityBenefit: 'Reduces peak-hour urban traffic congestion and curbs street-canyon exhaust traps.',
  },
  {
    id: 'smart_zoned_infrared_heat',
    title: 'Precision Infrared Zoned Space Heating',
    category: 'home_heating',
    replacesConventional: 'Whole-house central gas boiler or wood-burning stove',
    co2eReductionPercent: 60,
    smogReductionPercent: 100,
    financialPayoff: 'neutral',
    implementationSteps: [
      'Install directional far-infrared panels only in occupied zones (e.g. desk, bed).',
      'Use smart thermostatic plugs to automate shutoff when rooms are empty.',
      'Lower central ambient thermostat by 3°C while staying warm via radiant heat.',
    ],
    communityBenefit: 'Zero neighborhood chimney smoke emissions during temperature inversions.',
  },
  {
    id: 'induction_slow_cooker_combo',
    title: 'High-Efficiency Induction & Multi-Cooker Cooking',
    category: 'food_energy',
    replacesConventional: 'LPG or piped natural gas burner stoves',
    co2eReductionPercent: 65,
    smogReductionPercent: 90,
    financialPayoff: 'neutral',
    implementationSteps: [
      'Deploy portable 1800W induction cooktops with magnetic stainless or cast iron cookware.',
      'Batch-prepare winter stews and lentils using insulated pressure multi-cookers.',
      'Retire open flame burners that release unburned methane and combustion soot.',
    ],
    communityBenefit: 'Reduces residential fossil gas combustion in densely populated multi-family buildings.',
  },
  {
    id: 'microbial_composting_leaf_waste',
    title: 'Community In-Vessel Leaf & Organic Composting',
    category: 'community_action',
    replacesConventional: 'Open backyard or municipal leaf and yard-waste burning',
    co2eReductionPercent: 92,
    smogReductionPercent: 99,
    financialPayoff: 'saves_money',
    implementationSteps: [
      'Organize neighborhood collection bins for autumn and winter fallen leaves.',
      'Inoculate piles with bio-accelerators to decompose organic matter without smoke.',
      'Distribute rich compost to community gardens and neighborhood street trees in spring.',
    ],
    communityBenefit: 'Directly eradicates seasonal biomass smoke spikes that cause winter asthma emergencies.',
  },
];

/**
 * Filter alternatives by category.
 * @param category - Optional category filter.
 * @returns Array of matching sustainable alternatives.
 */
export function queryAlternatives(category?: AlternativeCategory): SustainableAlternative[] {
  if (!category) {
    return [...SUSTAINABLE_ALTERNATIVES];
  }
  return SUSTAINABLE_ALTERNATIVES.filter((alt) => alt.category === category);
}
