import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { Setting, SettingSchema } from './schemas/setting.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}

