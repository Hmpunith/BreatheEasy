/**
 * @file Indoor Hacks Engine Unit Tests
 * @description Verifies ranking algorithms, budget filtering, and situational fit scoring.
 */

import { describe, it, expect } from 'vitest';
import { recommendIndoorHacks, getHackCategories, type HomeProfile } from '../../server/domains/indoor/hackEngine';
import { queryIndoorHacks } from '../../server/domains/indoor/hackCatalog';

describe('Indoor Air Quality Hacks Engine Tests', () => {
  const baseProfile: HomeProfile = {
    homeType: 'apartment',
    budget: 'open',
    hasIndoorCombustion: true,
    hasPets: true,
  };

  it('ranks DIY Corsi-Rosenthal Box highly during severe smog episodes', () => {
    const recommendations = recommendIndoorHacks(250, baseProfile);
    const corsi = recommendations.find((r) => r.hack.id === 'diy_corsi_box');
    expect(corsi).toBeDefined();
    expect(corsi?.score).toBe(100);
    expect(corsi?.personalFitReason).toContain('Crucial emergency defense');
  });

  it('strictly excludes non-free hacks when budget is free_only', () => {
    const recommendations = recommendIndoorHacks(120, {
      ...baseProfile,
      budget: 'free_only',
    });
    expect(recommendations.every((r) => r.hack.costTier === 'free')).toBe(true);
  });

  it('boosts wet mopping score when pets are present', () => {
    const withPets = recommendIndoorHacks(80, { ...baseProfile, hasPets: true });
    const mop = withPets.find((r) => r.hack.id === 'wet_mop_protocol');
    expect(mop?.personalFitReason).toContain('Traps dander');
  });

  it('filters master catalog by category', () => {
    const diyOnly = queryIndoorHacks('diy');
    expect(diyOnly.length).toBeGreaterThan(0);
    expect(diyOnly.every((h) => h.category === 'diy')).toBe(true);
  });

  it('returns all hack categories', () => {
    const cats = getHackCategories();
    expect(cats).toContain('filtration');
    expect(cats).toContain('plants');
    expect(cats).toContain('diy');
  });
});
