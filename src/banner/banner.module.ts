import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { Banner, BannerSchema } from './schemas/banner.schema';
import { ResponseModule } from '../common/response/response.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ResponseModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
