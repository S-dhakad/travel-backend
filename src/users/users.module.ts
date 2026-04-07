import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { JwtStrategy } from '../guards/jwt.strategy';
import { SettingModule } from '../setting/setting.module';
import { S3UploadService } from '../common/services/s3.service';
import { MessagingModule } from '../common/messaging/messaging.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule,
    SettingModule,
    MessagingModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '7d';
        return {
          secret:
            configService.get<string>('JWT_SECRET') ||
            'your-secret-key-change-in-production',
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, S3UploadService],
  exports: [UsersService],
})
export class UsersModule { }
