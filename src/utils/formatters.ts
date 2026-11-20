/**
 * @file String and Metric Formatting Utilities
 * @description Helper functions for display values, units, and timestamps.
 * @module src/utils/formatters
 */

/**
 * Formats a numeric value with decimal precision.
 * @param val - Number to format.
 * @param decimals - Decimal places (default: 1).
 * @returns Formatted string.
 */
export function formatMetric(val: number, decimals = 1): string {
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Returns current timestamp in HH:MM AM/PM format.
 * @returns Human-readable time string.
 */
export function formatCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Truncates long text gracefully.
 * @param text - Input string.
 * @param max - Maximum character length.
 * @returns Truncated string with ellipsis if needed.
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}...`;
}
