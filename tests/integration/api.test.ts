/**
 * @file REST API Integration Tests
 * @description End-to-end integration tests verifying all BreatheEasy backend endpoints.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server/index';

describe('BreatheEasy REST API Integration Tests', () => {
  it('GET /api/health returns operational status and cache metrics', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('BreatheEasy');
    expect(res.body.cache).toBeDefined();
  });

  it('POST /api/aqi/classify returns valid classification', async () => {
    const res = await request(app).post('/api/aqi/classify').send({ aqi: 185 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.classification.severity).toBe('Unhealthy');
  });

  it('GET /api/aqi/pollutants returns all 6 tracked pollutants', async () => {
    const res = await request(app).get('/api/aqi/pollutants');
    expect(res.status).toBe(200);
    expect(res.body.pollutants.length).toBe(6);
  });

  it('POST /api/routines/generate generates personalized daily schedule', async () => {
    const res = await request(app).post('/api/routines/generate').send({
      aqi: 220,
      profile: {
        memberCount: 4,
        hasChildren: true,
        hasElderly: true,
        hasRespiratoryConditions: true,
        location: 'New Delhi',
      },
    });
    expect(res.status).toBe(200);
    expect(res.body.routine.activities.length).toBe(8);
    expect(res.body.routine.warnings.length).toBeGreaterThan(0);
  });

  it('GET /api/hacks returns curated indoor hacks catalog', async () => {
    const res = await request(app).get('/api/hacks');
    expect(res.status).toBe(200);
    expect(res.body.hacks.length).toBeGreaterThanOrEqual(6);
  });

  it('POST /api/hacks/recommend returns prioritized recommendations', async () => {
    const res = await request(app).post('/api/hacks/recommend').send({
      aqi: 280,
      profile: {
        homeType: 'apartment',
        budget: 'low_cost',
        hasIndoorCombustion: true,
        hasPets: true,
      },
    });
    expect(res.status).toBe(200);
    expect(res.body.recommendations.length).toBeGreaterThan(0);
  });

  it('POST /api/impact/calculate computes emission and PM2.5 savings', async () => {
    const res = await request(app).post('/api/impact/calculate').send({
      baselineActivityId: 'car_ice_gasoline',
      alternativeActivityId: 'metro_electric',
      volume: 25,
      frequencyMultiplier: 22,
    });
    expect(res.status).toBe(200);
    expect(res.body.report.netCo2eSavedKg).toBeGreaterThan(0);
    expect(res.body.report.netPm25ReducedGrams).toBeGreaterThan(0);
  });

  it('GET /api/alternatives returns sustainable alternatives list', async () => {
    const res = await request(app).get('/api/alternatives');
    expect(res.status).toBe(200);
    expect(res.body.alternatives.length).toBeGreaterThanOrEqual(4);
  });

  it('POST /api/alternatives/match ranks alternatives by goals', async () => {
    const res = await request(app).post('/api/alternatives/match').send({
      primaryFocus: 'health_first',
      density: 'dense_metro',
      commuteKm: 12,
    });
    expect(res.status).toBe(200);
    expect(res.body.matches.length).toBeGreaterThan(0);
  });

  it('POST /api/chat handles interactive conversation with grounding', async () => {
    const res = await request(app).post('/api/chat').send({
      prompt: 'What mask should my child wear in severe smog?',
      aqi: 240,
      location: 'New Delhi',
    });
    expect(res.status).toBe(200);
    expect(res.body.reply).toBeDefined();
    expect(res.body.source).toBeDefined();
  });

  it('POST /api/chat rejects empty prompt with 400 validation error', async () => {
    const res = await request(app).post('/api/chat').send({ prompt: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INPUT_VALIDATION_FAULT');
  });
});
