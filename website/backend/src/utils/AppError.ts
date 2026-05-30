/**
 * Custom Operational Error class for API responses
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture the stack trace, keeping constructor out of it
    Error.captureStackTrace(this, this.constructor);
  }
}
