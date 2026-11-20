/**
 * @file Sustainable Alternatives Matcher Unit Tests
 * @description Verifies green alternatives ranking against user priority and density contexts.
 */

import { describe, it, expect } from 'vitest';
import { matchSustainableAlternatives, getAlternativeCategories } from '../../server/domains/alternatives/greenEngine';
import { queryAlternatives } from '../../server/domains/alternatives/alternativeCatalog';

describe('Sustainable Alternatives Matcher Tests', () => {
  it('prioritizes cost-saving alternatives when cost_savings is selected', () => {
    const matches = matchSustainableAlternatives({
      primaryFocus: 'cost_savings',
      density: 'dense_metro',
      commuteKm: 15,
    });

    const top = matches[0];
    expect(top.alternative.financialPayoff).toBe('saves_money');
    expect(top.matchScore).toBeGreaterThanOrEqual(80);
  });

  it('boosts transit alternatives for long daily commutes (>10 km)', () => {
    const matches = matchSustainableAlternatives({
      primaryFocus: 'health_first',
      density: 'dense_metro',
      commuteKm: 25,
    });

    const transit = matches.find((m) => m.alternative.category === 'commute');
    expect(transit?.tailoredReason).toContain('25 km daily commute');
  });

  it('prioritizes community composting when community_impact is selected', () => {
    const matches = matchSustainableAlternatives({
      primaryFocus: 'community_impact',
      density: 'suburban',
      commuteKm: 5,
    });

    const compost = matches.find((m) => m.alternative.category === 'community_action');
    expect(compost?.matchScore).toBeGreaterThanOrEqual(90);
  });

  it('returns all categories from catalog and query function', () => {
    const cats = getAlternativeCategories();
    expect(cats).toContain('commute');
    expect(cats).toContain('home_heating');
    expect(cats).toContain('food_energy');
    expect(cats).toContain('community_action');

    const commuteOnly = queryAlternatives('commute');
    expect(commuteOnly.every((a) => a.category === 'commute')).toBe(true);
  });
});
