import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-log.schema';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';
import { ResponseModule } from '../common/response/response.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Package, PackageSchema } from '../package/schemas/package.schema';
import { Quote, QuoteSchema } from '../quote/schemas/quote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
      { name: User.name, schema: UserSchema },
      { name: Package.name, schema: PackageSchema },
      { name: Quote.name, schema: QuoteSchema },
    ]),
    ResponseModule
  ],
  controllers: [ActivityLogController],
  providers: [ActivityLogService],
  exports: [ActivityLogService]
})
export class ActivityLogModule {}
