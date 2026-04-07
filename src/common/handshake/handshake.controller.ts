import { Controller, Get, Post, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { HandshakeService } from './handshake.service';
import { ResponseService } from '../response/response.service';

@Controller('handshake')
export class HandshakeController {
  constructor(
    private readonly handshakeService: HandshakeService,
    private readonly responseService: ResponseService
  ) {}

  @Get('key')
  getKey() {
    return this.responseService.success(
      'Handshake key retrieved successfully',
      {
        handshakeKey: this.handshakeService.getHandshakeKey(),
        timestamp: new Date().toISOString()
      }
    );
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  validateHandshake(@Headers('x-handshake-key') handshakeKey: string) {
    const isValid = handshakeKey === this.handshakeService.getHandshakeKey();
    
    if (isValid) {
      return this.responseService.success(
        'Handshake key is valid',
        {
          timestamp: new Date().toISOString()
        }
      );
    } else {
      return this.responseService.error(
        'Invalid handshake key',
        'INVALID_HANDSHAKE_KEY'
      );
    }
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  generateClientToken(@Headers('x-client-id') clientId: string) {
    if (!clientId) {
      return this.responseService.error(
        'Client ID is required',
        'MISSING_CLIENT_ID'
      );
    }

    const token = this.handshakeService.generateClientToken(clientId);
    
    return this.responseService.success(
      'Client token generated successfully',
      {
        token,
        clientId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
      }
    );
  }

  @Post('token/validate')
  @HttpCode(HttpStatus.OK)
  validateClientToken(
    @Headers('x-client-id') clientId: string,
    @Headers('x-client-token') clientToken: string
  ) {
    if (!clientId || !clientToken) {
      return this.responseService.error(
        'Client ID and token are required',
        'MISSING_CREDENTIALS'
      );
    }

    const isValid = this.handshakeService.validateClientToken(clientToken, clientId);
    
    if (isValid) {
      return this.responseService.success(
        'Client token is valid',
        {
          timestamp: new Date().toISOString()
        }
      );
    } else {
      return this.responseService.error(
        'Invalid or expired client token',
        'INVALID_CLIENT_TOKEN'
      );
    }
  }
}
