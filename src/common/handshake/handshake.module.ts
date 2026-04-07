import { Module } from '@nestjs/common';
import { HandshakeService } from './handshake.service';
import { HandshakeMiddleware } from './handshake.middleware';
import { HandshakeController } from './handshake.controller';
import { ResponseModule } from '../response/response.module';

@Module({
  imports: [ResponseModule],
  controllers: [HandshakeController],
  providers: [HandshakeService, HandshakeMiddleware],
  exports: [HandshakeService],
})
export class HandshakeModule {}
