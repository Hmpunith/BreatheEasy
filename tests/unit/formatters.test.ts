/**
 * @file Formatter Utilities Unit Tests
 * @description Verifies metric numbers, string truncation, and date helpers.
 */

import { describe, it, expect } from 'vitest';
import { formatMetric, truncate, formatCurrentTime } from '../../src/utils/formatters';

describe('Formatter Utilities Tests', () => {
  it('formats metric numbers to specified decimal places', () => {
    expect(formatMetric(123.456, 1)).toBe('123.5');
    expect(formatMetric(42, 2)).toBe('42.00');
  });

  it('truncates strings exceeding max length with ellipsis', () => {
    expect(truncate('Hello world', 5)).toBe('Hello...');
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('generates non-empty current time string', () => {
    const time = formatCurrentTime();
    expect(time.length).toBeGreaterThan(0);
  });
});
