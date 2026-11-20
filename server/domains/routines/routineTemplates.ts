/**
 * @file Daily Routine Templates
 * @description Activity templates organized by AQI severity for routine generation.
 * @module server/domains/routines/routineTemplates
 */

/** Represents a single routine activity recommendation. */
export interface RoutineActivity {
  /** Time of day for the activity. */
  timeSlot: string;
  /** Activity description. */
  activity: string;
  /** Whether the activity is indoor or outdoor. */
  location: 'indoor' | 'outdoor' | 'either';
  /** Emission impact category. */
  emissionCategory: 'low' | 'moderate' | 'high';
  /** Tip to reduce environmental impact. */
  greenTip: string;
}

/** Activity templates for 'Good' AQI days (0–50). */
export const GOOD_DAY_ROUTINES: RoutineActivity[] = [
  { timeSlot: '6:00 AM', activity: 'Morning jog or cycling in the park', location: 'outdoor', emissionCategory: 'low', greenTip: 'Walk or cycle instead of driving — zero emissions and great for health.' },
  { timeSlot: '7:30 AM', activity: 'Open windows for natural ventilation', location: 'indoor', emissionCategory: 'low', greenTip: 'Natural air exchange reduces reliance on mechanical HVAC systems.' },
  { timeSlot: '8:00 AM', activity: 'Prepare breakfast with electric induction', location: 'indoor', emissionCategory: 'low', greenTip: 'Induction cooking produces zero indoor combustion pollutants.' },
  { timeSlot: '9:00 AM', activity: 'Commute by public transit or carpool', location: 'outdoor', emissionCategory: 'moderate', greenTip: 'Public transit reduces per-capita emissions by 45% vs solo driving.' },
  { timeSlot: '12:00 PM', activity: 'Outdoor lunch at a local cafe (walk there)', location: 'outdoor', emissionCategory: 'low', greenTip: 'Supporting walkable local businesses reduces delivery emissions.' },
  { timeSlot: '5:00 PM', activity: 'Outdoor playground time for children', location: 'outdoor', emissionCategory: 'low', greenTip: 'Active outdoor play replaces screen time with zero-emission fun.' },
  { timeSlot: '7:00 PM', activity: 'Prepare dinner using seasonal local produce', location: 'indoor', emissionCategory: 'low', greenTip: 'Seasonal produce has 10x lower transport emissions than imported food.' },
  { timeSlot: '9:00 PM', activity: 'Evening walk in the neighborhood', location: 'outdoor', emissionCategory: 'low', greenTip: 'Walking builds community connections with zero environmental cost.' },
];

/** Activity templates for 'Moderate' AQI days (51–100). */
export const MODERATE_DAY_ROUTINES: RoutineActivity[] = [
  { timeSlot: '6:30 AM', activity: 'Indoor yoga or stretching session', location: 'indoor', emissionCategory: 'low', greenTip: 'Indoor exercise avoids moderate-AQI exposure while keeping active.' },
  { timeSlot: '7:30 AM', activity: 'Brief window ventilation (15 min max)', location: 'indoor', emissionCategory: 'low', greenTip: 'Short ventilation windows minimize pollutant entry on moderate days.' },
  { timeSlot: '8:00 AM', activity: 'Cook with electric appliances, use range hood', location: 'indoor', emissionCategory: 'low', greenTip: 'Range hoods remove 70% of cooking-generated indoor pollutants.' },
  { timeSlot: '9:00 AM', activity: 'Commute by electric vehicle or metro', location: 'outdoor', emissionCategory: 'low', greenTip: 'EVs produce zero tailpipe emissions even on moderate AQI days.' },
  { timeSlot: '12:00 PM', activity: 'Indoor lunch, limit outdoor time to 30 min', location: 'either', emissionCategory: 'low', greenTip: 'Short outdoor breaks still provide benefits with limited exposure.' },
  { timeSlot: '4:00 PM', activity: 'Indoor play or creative activities for kids', location: 'indoor', emissionCategory: 'low', greenTip: 'Art and reading are zero-emission activities that boost development.' },
  { timeSlot: '7:00 PM', activity: 'Cook plant-based dinner', location: 'indoor', emissionCategory: 'low', greenTip: 'Plant-based meals have 50% lower carbon footprint than meat-based ones.' },
  { timeSlot: '8:30 PM', activity: 'Monitor next-day AQI forecast and plan', location: 'indoor', emissionCategory: 'low', greenTip: 'Planning ahead lets you optimize routes and reduce unnecessary trips.' },
];

/** Activity templates for 'Unhealthy' or worse AQI days (151+). */
export const HIGH_AQI_ROUTINES: RoutineActivity[] = [
  { timeSlot: '6:30 AM', activity: 'Indoor workout with air purifier running', location: 'indoor', emissionCategory: 'low', greenTip: 'HEPA purifiers remove 99.97% of PM2.5 indoors during exercise.' },
  { timeSlot: '7:00 AM', activity: 'Keep all windows sealed, run air filtration', location: 'indoor', emissionCategory: 'low', greenTip: 'Sealed windows + HEPA can reduce indoor PM2.5 by 80% on smog days.' },
  { timeSlot: '8:00 AM', activity: 'Avoid gas cooking — use microwave or induction', location: 'indoor', emissionCategory: 'low', greenTip: 'Gas stoves release NO₂ and CO indoors, compounding unhealthy outdoor air.' },
  { timeSlot: '9:00 AM', activity: 'Work from home if possible', location: 'indoor', emissionCategory: 'low', greenTip: 'Remote work eliminates commute emissions and reduces smog exposure.' },
  { timeSlot: '12:00 PM', activity: 'Indoor lunch, NO outdoor exposure', location: 'indoor', emissionCategory: 'low', greenTip: 'Even 30 minutes in hazardous air can cause acute respiratory inflammation.' },
  { timeSlot: '3:00 PM', activity: 'Wet-mop floors to trap settled particulates', location: 'indoor', emissionCategory: 'low', greenTip: 'Wet mopping captures dust that dry sweeping pushes back into the air.' },
  { timeSlot: '5:00 PM', activity: 'Indoor board games or reading for children', location: 'indoor', emissionCategory: 'low', greenTip: 'Children breathe 50% more air per body weight — keeping them indoors is critical.' },
  { timeSlot: '7:00 PM', activity: 'Steam-based cooking to minimize indoor emissions', location: 'indoor', emissionCategory: 'low', greenTip: 'Steaming produces fewer airborne particles than frying or grilling.' },
];

/**
 * Selects the appropriate routine template based on AQI value.
 * @param aqi - The current Air Quality Index value.
 * @returns Array of routine activities for that AQI level.
 */
export function getRoutinesByAqi(aqi: number): RoutineActivity[] {
  if (aqi <= 50) {
    return [...GOOD_DAY_ROUTINES];
  }
  if (aqi <= 100) {
    return [...MODERATE_DAY_ROUTINES];
  }
  return [...HIGH_AQI_ROUTINES];
}
