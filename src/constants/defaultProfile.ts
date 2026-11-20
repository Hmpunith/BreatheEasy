/**
 * @file Default Family and Home Profile Constants
 * @description Initial baseline states for demographic and household context.
 * @module src/constants/defaultProfile
 */

import type { FamilyProfile, HomeProfile } from '../types';

export const DEFAULT_FAMILY_PROFILE: FamilyProfile = {
  memberCount: 4,
  hasChildren: true,
  hasElderly: true,
  hasRespiratoryConditions: true,
  location: 'New Delhi, India',
};

export const DEFAULT_HOME_PROFILE: HomeProfile = {
  homeType: 'apartment',
  budget: 'low_cost',
  hasIndoorCombustion: true,
  hasPets: true,
};
