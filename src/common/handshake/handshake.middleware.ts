import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HandshakeService } from './handshake.service';
import { ResponseService } from '../response/response.service';

@Injectable()
export class HandshakeMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HandshakeMiddleware.name);

  constructor(
    private readonly handshakeService: HandshakeService,
    private readonly responseService: ResponseService
  ) { }

  use(req: Request, res: Response, next: NextFunction): void {
    // req.path only contains the path part (e.g. /), ignoring query params (?userId=...)
    const requestPath = req.path;

    // Direct check for socket.io to avoid any interference
    if (requestPath.includes('/socket.io')) {
      next();
      return;
    }

    // Skip handshake validation for public routes
    const publicPaths = [
      '/api/auth',
      '/api/health',
      '/api/docs',
      '/health',
      '/handshake',
      '/public',
      '/activity-log',
      '/quote',
      '/package',
      '/category',
      '/landing-page',
      '/subcategory',
      '/setting',
      '/testimonial',
      '/banner',
      '/legal'
    ];

    const isPublic = publicPaths.some(path => requestPath.startsWith(path)) || requestPath === '/';

    if (isPublic) {
      this.logger.debug(`Public route accessed: ${requestPath}`);
      next();
      return;
    }

    // Validate handshake key for protected routes
    const isValidHandshake = this.handshakeService.validateHandshake(req);

    if (!isValidHandshake) {
      this.logger.warn(`Invalid handshake attempt for path: ${requestPath}`);
      const errorResponse = this.responseService.error(
        'Unauthorized: Invalid or missing handshake key',
        'HANDSHAKE_REQUIRED'
      );
      res.status(401).json(errorResponse);
      return;
    }

    this.logger.debug(`Handshake validated for path: ${requestPath}`);
    next();
  }
}
