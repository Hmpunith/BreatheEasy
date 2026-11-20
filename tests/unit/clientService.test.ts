/**
 * @file Client API Service Unit Tests
 * @description Verifies fetch client methods, error status mapping, and endpoint communication.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchAqiClassification,
  fetchPollutants,
  fetchDailyRoutine,
  fetchRecommendedHacks,
  fetchImpactReport,
  sendCopilotChat,
} from '../../src/services/breatheApi';
import { ApiPayloadError } from '../../src/errors/ClientError';

describe('Client API Service (breatheApi)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches AQI classification successfully', async () => {
    const mockAssessment = {
      aqi: 150,
      severity: 'Unhealthy for Sensitive Groups',
      color: '#f97316',
      advisory: 'Limit exposure.',
      outdoorAdvice: 'Reduce jogging.',
      maskAdvice: 'N95 advised.',
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, classification: mockAssessment }),
    } as unknown as Response);

    const result = await fetchAqiClassification(150);
    expect(result.severity).toBe('Unhealthy for Sensitive Groups');
    expect(result.aqi).toBe(150);
  });

  it('fetches pollutant list successfully', async () => {
    const mockPollutants = [
      { id: 'pm25', name: 'Fine Particulate Matter (PM2.5)', standard: '15 µg/m³' },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, pollutants: mockPollutants }),
    } as unknown as Response);

    const result = await fetchPollutants();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('pm25');
  });

  it('generates tailored daily routine successfully', async () => {
    const mockProfile = {
      memberCount: 3,
      hasChildren: true,
      hasElderly: false,
      hasRespiratoryConditions: true,
      location: 'New Delhi',
    };
    const mockRoutine = {
      aqi: 220,
      profile: mockProfile,
      activities: [],
      warnings: ['Run indoor air purifier.'],
      estimatedSavingsKg: 2.5,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, routine: mockRoutine }),
    } as unknown as Response);

    const result = await fetchDailyRoutine(220, mockProfile);

    expect(result.profile.location).toBe('New Delhi');
    expect(result.warnings).toContain('Run indoor air purifier.');
  });

  it('recommends indoor IAQ hacks successfully', async () => {
    const mockHacks = [
      {
        hack: {
          id: 'corsi_box',
          title: 'Corsi-Rosenthal Box',
          category: 'diy' as const,
          effectivenessPercent: 85,
          costTier: 'low' as const,
          effortLevel: 'moderate' as const,
          instructions: 'Build filter box.',
          impactRationale: 'Removes PM2.5.',
        },
        score: 95,
        personalFitReason: 'Best for apartments with pets.',
      },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, recommendations: mockHacks }),
    } as unknown as Response);

    const result = await fetchRecommendedHacks(250, {
      homeType: 'apartment',
      budget: 'low_cost',
      hasIndoorCombustion: false,
      hasPets: true,
    });

    expect(result.length).toBe(1);
    expect(result[0].hack.id).toBe('corsi_box');
  });

  it('calculates comparative environmental impact successfully', async () => {
    const mockReport = {
      baselineCo2eKg: 80,
      alternativeCo2eKg: 10,
      netCo2eSavedKg: 70,
      baselinePm25Grams: 20,
      alternativePm25Grams: 2,
      netPm25ReducedGrams: 18,
      treeSeedlingsEquivalent: 3.2,
      executiveSummary: 'Substantial emission reductions.',
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, report: mockReport }),
    } as unknown as Response);

    const result = await fetchImpactReport('car_ice_gasoline', 'metro_electric', 20, 20);
    expect(result.netCo2eSavedKg).toBe(70);
    expect(result.netPm25ReducedGrams).toBe(18);
  });

  it('sends query to AirSense Copilot successfully', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        reply: 'Wear an N95 mask.',
        source: 'cache',
      }),
    } as unknown as Response);

    const result = await sendCopilotChat('What mask to wear?', 250, 'Delhi');
    expect(result.reply).toBe('Wear an N95 mask.');
    expect(result.source).toBe('cache');
  });

  it('throws ApiPayloadError when server responds with failure payload', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: { message: 'Invalid AQI value.', code: 'INVALID_AQI' },
      }),
    } as unknown as Response);

    await expect(fetchAqiClassification(-10)).rejects.toThrow(ApiPayloadError);
  });
});
