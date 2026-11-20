/**
 * @file Client Error Hierarchy
 * @description Standardized error classes for front-end network and validation exceptions.
 * @module src/errors/ClientError
 */

/** Base application error for client-side operations. */
export class ClientError extends Error {
  public readonly code: string;

  constructor(message: string, code = 'CLIENT_ERROR') {
    super(message);
    this.name = 'ClientError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when fetch or network communication fails. */
export class NetworkError extends ClientError {
  constructor(message = 'Network request failed. Please check your connectivity.') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/** Thrown when the server returns a structured API error response. */
export class ApiPayloadError extends ClientError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number, code = 'API_ERROR') {
    super(message, code);
    this.name = 'ApiPayloadError';
    this.statusCode = statusCode;
  }
}
