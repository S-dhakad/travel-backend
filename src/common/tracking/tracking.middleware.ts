import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TrackingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const systemInfo = req.headers['x-system-info'];
    const locationInfo = req.headers['x-location-info'];

    if (systemInfo) {
      try {
        req['systemInfo'] = JSON.parse(systemInfo as string);
      } catch (e) {
        console.error('Failed to parse x-system-info header', e);
      }
    }

    if (locationInfo) {
      try {
        req['locationInfo'] = JSON.parse(locationInfo as string);
      } catch (e) {
        console.error('Failed to parse x-location-info header', e);
      }
    }

    next();
  }
}
