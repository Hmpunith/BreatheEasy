/**
 * @file BreatheEasy Client API Service
 * @description High-level client wrapper for calling server API endpoints with typed error handling.
 * @module src/services/breatheApi
 */

import { NetworkError, ApiPayloadError } from '../errors/ClientError';
import type {
  AqiAssessment,
  PollutantDetail,
  DailyRoutine,
  RankedHack,
  ImpactReport,
  FamilyProfile,
  HomeProfile,
} from '../types';

/** Generic HTTP JSON client helper. */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  } catch (error) {
    throw new NetworkError((error as Error).message);
  }

  const data = await response.json();
  if (!response.ok || !data.success) {
    const errorMsg = data?.error?.message || `Request failed with status ${response.status}`;
    const errorCode = data?.error?.code || 'HTTP_ERROR';
    throw new ApiPayloadError(errorMsg, response.status, errorCode);
  }

  return data;
}

/**
 * Classifies an AQI value.
 */
export async function fetchAqiClassification(aqi: number): Promise<AqiAssessment> {
  const result = await request<{ classification: AqiAssessment }>('/api/aqi/classify', {
    method: 'POST',
    body: JSON.stringify({ aqi }),
  });
  return result.classification;
}

/**
 * Fetches the master list of pollutants.
 */
export async function fetchPollutants(): Promise<PollutantDetail[]> {
  const result = await request<{ pollutants: PollutantDetail[] }>('/api/aqi/pollutants');
  return result.pollutants;
}

/**
 * Generates a tailored daily routine.
 */
export async function fetchDailyRoutine(aqi: number, profile: FamilyProfile): Promise<DailyRoutine> {
  const result = await request<{ routine: DailyRoutine }>('/api/routines/generate', {
    method: 'POST',
    body: JSON.stringify({ aqi, profile }),
  });
  return result.routine;
}

/**
 * Recommends indoor air quality hacks.
 */
export async function fetchRecommendedHacks(aqi: number, profile: HomeProfile): Promise<RankedHack[]> {
  const result = await request<{ recommendations: RankedHack[] }>('/api/hacks/recommend', {
    method: 'POST',
    body: JSON.stringify({ aqi, profile }),
  });
  return result.recommendations;
}

/**
 * Computes comparative emission impact.
 */
export async function fetchImpactReport(
  baselineActivityId: string,
  alternativeActivityId: string,
  volume: number,
  frequencyMultiplier: number,
): Promise<ImpactReport> {
  const result = await request<{ report: ImpactReport }>('/api/impact/calculate', {
    method: 'POST',
    body: JSON.stringify({
      baselineActivityId,
      alternativeActivityId,
      volume,
      frequencyMultiplier,
    }),
  });
  return result.report;
}

/**
 * Sends a query to the AirSense Copilot.
 */
export async function sendCopilotChat(
  prompt: string,
  aqi: number,
  location: string,
  profile?: FamilyProfile,
): Promise<{ reply: string; source: 'gemini' | 'cache' | 'fallback' }> {
  return request<{ reply: string; source: 'gemini' | 'cache' | 'fallback' }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt, aqi, location, profile }),
  });
}
