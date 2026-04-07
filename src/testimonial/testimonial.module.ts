import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import {
  Testimonial,
  TestimonialSchema,
} from './schemas/testimonial.schema';
import { ResponseService } from '../common/response/response.service';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService, ResponseService, AuthGuard],
  exports: [TestimonialService],
})
export class TestimonialModule { }
