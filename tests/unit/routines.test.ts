/**
 * @file Routine Generation Unit Tests
 * @description Verifies personalized daily routine synthesis, emission savings, and vulnerability warnings.
 */

import { describe, it, expect } from 'vitest';
import { generateDailyRoutine, type FamilyProfile } from '../../server/domains/routines/routineEngine';
import { getRoutinesByAqi } from '../../server/domains/routines/routineTemplates';

describe('Daily Routine Generation Engine Tests', () => {
  const mockProfile: FamilyProfile = {
    memberCount: 4,
    hasChildren: true,
    hasElderly: true,
    hasRespiratoryConditions: true,
    location: 'New Delhi, India',
  };

  it('generates low-emission routine for Good AQI days', () => {
    const routine = generateDailyRoutine(35, mockProfile);
    expect(routine.activities.length).toBe(8);
    expect(routine.estimatedSavingsKg).toBeGreaterThan(0);
  });

  it('generates high-smog protective routine for AQI > 150', () => {
    const routine = generateDailyRoutine(240, mockProfile);
    expect(routine.activities.every((a) => a.location === 'indoor' || a.location === 'either')).toBe(true);
    expect(routine.warnings.length).toBeGreaterThan(0);
  });

  it('triggers specific warnings for children and respiratory vulnerabilities', () => {
    const routine = generateDailyRoutine(180, mockProfile);
    const joined = routine.warnings.join(' ');
    expect(joined).toContain('Children under 12');
    expect(joined).toContain('respiratory');
  });

  it('triggers hazardous alert when AQI exceeds 300', () => {
    const routine = generateDailyRoutine(340, mockProfile);
    const joined = routine.warnings.join(' ');
    expect(joined).toContain('HAZARDOUS');
  });

  it('selects template accurately via getRoutinesByAqi', () => {
    const good = getRoutinesByAqi(40);
    const moderate = getRoutinesByAqi(80);
    const high = getRoutinesByAqi(210);

    expect(good[0].activity).toContain('Morning jog');
    expect(moderate[0].activity).toContain('Indoor yoga');
    expect(high[0].activity).toContain('air purifier');
  });
});
