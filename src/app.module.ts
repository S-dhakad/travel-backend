import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseModule } from './common/response/response.module';
import { HandshakeModule } from './common/handshake/handshake.module';
import { HandshakeMiddleware } from './common/handshake/handshake.middleware';
import { MessagingModule } from './common/messaging/messaging.module';
import { UsersModule } from './users/users.module';
import { SettingModule } from './setting/setting.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { BannerModule } from './banner/banner.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { PackageModule } from './package/package.module';
import { QuoteModule } from './quote/quote.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { TrackingMiddleware } from './common/tracking/tracking.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          uri:
            configService.get<string>('MONGODB_URI') ||
            'mongodb://localhost:27017/ludoking',
        }) as any,
      inject: [ConfigService],
    }),
    ResponseModule,
    HandshakeModule,
    MessagingModule,
    UsersModule,
    SettingModule,
    CategoryModule,
    SubcategoryModule,
    BannerModule,
    TestimonialModule,
    PackageModule,
    QuoteModule,
    ActivityLogModule,
    LandingPageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HandshakeMiddleware, TrackingMiddleware)
      .exclude(
        { path: '/handshake', method: RequestMethod.GET },
        { path: '/handshake/*path', method: RequestMethod.POST },
        { path: '/api/auth/*path', method: RequestMethod.POST },
        { path: '/api', method: RequestMethod.GET },
        { path: '/health', method: RequestMethod.GET },
        { path: '/', method: RequestMethod.GET },
        { path: '/public/*path', method: RequestMethod.GET },
        { path: '/socket.io*path', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
