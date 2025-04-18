import { v4 as uuidv4 } from 'uuid';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export const REQUEST_ID_HEADER = 'X-Request-ID';

export function generateRequestId(): string {
  return uuidv4();
}

/**
 * Express middleware to handle request IDs
 * - Uses existing request ID from header if present
 * - Generates new request ID if not present
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Use existing request ID from header or generate a new one
    const requestId = req.header(REQUEST_ID_HEADER) || generateRequestId();

    // Set the request ID in the request object for controllers to access
    req['requestId'] = requestId;

    // Set the request ID in the response header
    res.setHeader(REQUEST_ID_HEADER, requestId);

    next();
  }
}

/**
 * Gets the request ID from RabbitMQ message headers or generates a new one
 */
export function getRequestIdFromRabbitMQ(headers: any): string {
  return headers?.requestId || generateRequestId();
}

/**
 * Creates RabbitMQ message headers with request ID
 */
export function createRabbitMQHeadersWithRequestId(
  requestId?: string,
): Record<string, any> {
  return {
    requestId: requestId || generateRequestId(),
  };
}
