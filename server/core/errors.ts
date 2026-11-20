/**
 * @file BreatheEasy Error Hierarchy
 * @description Domain-specific error classes for air quality operations.
 * @module server/core/errors
 */

/**
 * Base application error for BreatheEasy operations.
 * @extends Error
 */
export class AirQualityError extends Error {
  /** HTTP status code for the error response. */
  public readonly statusCode: number;
  /** Machine-readable error code. */
  public readonly code: string;
  /** Whether the error is an expected operational fault. */
  public readonly isOperational: boolean;

  /**
   * @param message - Human-readable error description.
   * @param statusCode - HTTP status code.
   * @param code - Machine-readable error identifier.
   * @param isOperational - Whether this is an expected fault.
   */
  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message);
    this.name = 'AirQualityError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when request input fails validation. */
export class InputValidationError extends AirQualityError {
  constructor(message: string) {
    super(message, 400, 'INPUT_VALIDATION_FAULT');
    this.name = 'InputValidationError';
  }
}

/** Thrown when a requested resource is not found. */
export class ResourceNotFoundError extends AirQualityError {
  constructor(resource: string) {
    super(`Resource '${resource}' not found.`, 404, 'RESOURCE_NOT_FOUND');
    this.name = 'ResourceNotFoundError';
  }
}

/** Thrown when rate limits are exceeded. */
export class ThrottleError extends AirQualityError {
  constructor() {
    super('Too many requests. Please wait before retrying.', 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'ThrottleError';
  }
}

/** Thrown when the external AI service fails. */
export class AiServiceError extends AirQualityError {
  constructor(detail: string) {
    super(`AI service unavailable: ${detail}`, 502, 'AI_SERVICE_FAULT', true);
    this.name = 'AiServiceError';
  }
}

/** Thrown when AQI data is invalid or out of range. */
export class AqiDataError extends AirQualityError {
  constructor(message: string) {
    super(message, 422, 'AQI_DATA_FAULT');
    this.name = 'AqiDataError';
  }
}
