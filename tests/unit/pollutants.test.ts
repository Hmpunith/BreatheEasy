/**
 * @file Pollutant Catalog Unit Tests
 * @description Verifies pollutant reference catalog completeness, WHO thresholds, and queries.
 */

import { describe, it, expect } from 'vitest';
import { POLLUTANT_CATALOG, getPollutantById } from '../../server/domains/aqi/pollutantData';

describe('Pollutant Master Catalog Tests', () => {
  it('contains all 6 primary criteria urban air pollutants', () => {
    const ids = POLLUTANT_CATALOG.map((p) => p.id);
    expect(ids).toContain('pm25');
    expect(ids).toContain('pm10');
    expect(ids).toContain('no2');
    expect(ids).toContain('o3');
    expect(ids).toContain('so2');
    expect(ids).toContain('co');
  });

  it('retrieves specific pollutant by id', () => {
    const pm25 = getPollutantById('pm25');
    expect(pm25).toBeDefined();
    expect(pm25?.name).toContain('Fine Particulate');
    expect(pm25?.whoGuideline).toBe(15);
  });

  it('returns undefined for non-existent pollutant id', () => {
    expect(getPollutantById('non_existent')).toBeUndefined();
  });

  it('ensures every pollutant has defined sources and health impact description', () => {
    POLLUTANT_CATALOG.forEach((p) => {
      expect(p.sources.length).toBeGreaterThan(0);
      expect(p.healthImpact.length).toBeGreaterThan(15);
      expect(p.breakpoints.length).toBe(6);
    });
  });
});
