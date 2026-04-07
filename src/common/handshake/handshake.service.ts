import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHmac } from 'crypto';
import { Request } from 'express';

@Injectable()
export class HandshakeService {
  private readonly logger = new Logger(HandshakeService.name);
  private readonly handshakeKey: string;

  constructor(private configService: ConfigService) {
    this.handshakeKey = this.configService.get<string>('HANDSHAKE_KEY') || this.generateHandshakeKey();
    this.logger.log('Handshake service initialized');
  }

  private generateHandshakeKey(): string {
    const key = randomBytes(32).toString('hex');
    this.logger.log('Generated new handshake key');
    return key;
  }

  getHandshakeKey(): string {
    return this.handshakeKey;
  }

  validateHandshake(request: Request): boolean {
    const providedKey = request.headers['x-handshake-key'] as string;
    
    if (!providedKey) {
      this.logger.warn('No handshake key provided in request');
      return false;
    }

    if (providedKey !== this.handshakeKey) {
      this.logger.warn('Invalid handshake key provided');
      return false;
    }

    return true;
  }

  generateClientToken(clientId: string): string {
    const timestamp = Date.now().toString();
    const payload = `${clientId}:${timestamp}`;
    const token = createHmac('sha256', this.handshakeKey)
      .update(payload)
      .digest('hex');
    
    return `${token}:${timestamp}`;
  }

  validateClientToken(token: string, clientId: string): boolean {
    const [hash, timestamp] = token.split(':');
    
    if (!hash || !timestamp) {
      return false;
    }

    // Check if token is not older than 5 minutes
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 5 * 60 * 1000) {
      return false;
    }

    const expectedHash = createHmac('sha256', this.handshakeKey)
      .update(`${clientId}:${timestamp}`)
      .digest('hex');

    return hash === expectedHash;
  }
}
