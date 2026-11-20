/**
 * @file AQI Classifier Unit Tests
 * @description Verifies AQI threshold breakpoints, severity labelling, colors, and error handling.
 */

import { describe, it, expect } from 'vitest';
import { classifyAqi, getSeverityBands } from '../../server/domains/aqi/aqiClassifier';

describe('AQI Classifier Engine Tests', () => {
  it('correctly classifies Good air quality (0–50)', () => {
    const result = classifyAqi(35);
    expect(result.severity).toBe('Good');
    expect(result.color).toBe('#22c55e');
    expect(result.maskAdvice).toContain('No mask needed');
  });

  it('correctly classifies Moderate air quality (51–100)', () => {
    const result = classifyAqi(75);
    expect(result.severity).toBe('Moderate');
    expect(result.color).toBe('#eab308');
  });

  it('correctly classifies Unhealthy for Sensitive Groups (101–150)', () => {
    const result = classifyAqi(130);
    expect(result.severity).toBe('Unhealthy for Sensitive Groups');
    expect(result.color).toBe('#f97316');
  });

  it('correctly classifies Unhealthy air quality (151–200)', () => {
    const result = classifyAqi(180);
    expect(result.severity).toBe('Unhealthy');
    expect(result.color).toBe('#ef4444');
    expect(result.maskAdvice).toContain('N95 mask strongly recommended');
  });

  it('correctly classifies Very Unhealthy air quality (201–300)', () => {
    const result = classifyAqi(260);
    expect(result.severity).toBe('Very Unhealthy');
    expect(result.color).toBe('#a855f7');
  });

  it('correctly classifies Hazardous air quality (301+)', () => {
    const result = classifyAqi(420);
    expect(result.severity).toBe('Hazardous');
    expect(result.color).toBe('#991b1b');
    expect(result.outdoorAdvice).toContain('Do not go outdoors');
  });

  it('handles boundary edges exactly (50, 100, 150, 200, 300)', () => {
    expect(classifyAqi(50).severity).toBe('Good');
    expect(classifyAqi(100).severity).toBe('Moderate');
    expect(classifyAqi(150).severity).toBe('Unhealthy for Sensitive Groups');
    expect(classifyAqi(200).severity).toBe('Unhealthy');
    expect(classifyAqi(300).severity).toBe('Very Unhealthy');
  });

  it('throws error for negative AQI input', () => {
    expect(() => classifyAqi(-15)).toThrow('AQI value cannot be negative.');
  });

  it('returns all defined severity bands', () => {
    const bands = getSeverityBands();
    expect(bands.length).toBe(6);
  });
});
