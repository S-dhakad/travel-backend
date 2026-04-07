import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
  DeleteTestimonialDto,
  GetTestimonialDto,
  GetTestimonialsFilterDto,
} from './dto/testimonial.dto';
import { ApiResponse } from '../common/type/response.type';
import { AuthGuard } from '../guards/auth.guard';

@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) { }

  @Post('create')
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Body() createTestimonialDto: CreateTestimonialDto,
  ): Promise<ApiResponse> {
    return await this.testimonialService.create(createTestimonialDto, req);
  }

  @Post('list')
  async findAll(@Request() req: any, @Body() filterDto: GetTestimonialsFilterDto): Promise<ApiResponse> {
    return await this.testimonialService.findAll(filterDto, req);
  }

  @Post('get')
  async findOne(@Request() req: any, @Body() getTestimonialDto: GetTestimonialDto): Promise<ApiResponse> {
    return await this.testimonialService.findOne(getTestimonialDto, req);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<ApiResponse> {
    return await this.testimonialService.update(updateTestimonialDto, req);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  async delete(
    @Request() req: any,
    @Body() deleteTestimonialDto: DeleteTestimonialDto
  ): Promise<ApiResponse> {
    return await this.testimonialService.delete(deleteTestimonialDto, req);
  }
}
