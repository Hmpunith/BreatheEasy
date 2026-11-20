/**
 * @file Vitest Test Environment Setup
 * @description Configures DOM testing matchers and mocks global browser APIs.
 */

process.env.NODE_ENV = 'test';

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock window.matchMedia for happy-dom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock global fetch for DOM tests to prevent unhandled ECONNREFUSED network attempts in happy-dom
const defaultApiResponse: Record<string, unknown> = {
  success: true,
  classification: {
    aqi: 185,
    severity: 'Unhealthy',
    color: '#f97316',
    bgTint: 'bg-orange-500/10',
    borderTint: 'border-orange-500/30',
    textTint: 'text-orange-400',
    summary: 'Active children and adults should avoid prolonged outdoor exertion.',
    advisory: 'Wear N95 masks outdoors, run indoor air filtration, and keep windows sealed.',
    sensitiveGroups: 'Children, older adults, and individuals with asthma.',
  },
  pollutants: [],
  routine: {
    routineId: 'mock-routine',
    aqi: 185,
    activities: [],
    warnings: [],
    generatedAt: new Date().toISOString(),
  },
  hacks: [],
  recommendations: [],
  report: {
    dailyCo2ReductionGrams: 3200,
    monthlyCo2ReductionKg: 96,
    annualCo2ReductionKg: 1168,
    pm25ReductionGrams: 42,
    equivalentTreesPlantedPerYear: 53,
    equivalentCarKmSavedPerYear: 5840,
    calculations: [],
  },
  alternatives: [],
  matches: [],
  reply: 'AirSense Copilot guidance: Prioritize indoor air quality and seal windows.',
};

globalThis.fetch = vi.fn().mockImplementation(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => defaultApiResponse,
    text: async () => JSON.stringify(defaultApiResponse),
  } as Response);
});
