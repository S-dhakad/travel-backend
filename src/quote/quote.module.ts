import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { Quote, QuoteSchema } from './schemas/quote.schema';
import { ResponseModule } from '../common/response/response.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
    ResponseModule,
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
  exports: [QuoteService],
})
export class QuoteModule {}
