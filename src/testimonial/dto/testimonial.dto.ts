import { IsString, IsOptional, IsEnum, IsNotEmpty, IsNumber, IsMongoId, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../../common/enums/status.enum';

export class CreateTestimonialDto {
  @ApiProperty()
  @IsString({ message: 'Image URL must be a string' })
  @IsNotEmpty({ message: 'Image is required' })
  image: string;

  @ApiProperty()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty()
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;
}

export class UpdateTestimonialDto {
  @ApiProperty()
  @IsString({ message: 'Testimonial ID must be a string' })
  @IsNotEmpty({ message: 'Testimonial ID is required' })
  testimonialId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;
}

export class DeleteTestimonialDto {
  @ApiProperty()
  @IsString({ message: 'Testimonial ID must be a string' })
  @IsNotEmpty({ message: 'Testimonial ID is required' })
  testimonialId: string;
}

export class GetTestimonialDto {
  @ApiProperty()
  @IsString({ message: 'Testimonial ID must be a string' })
  @IsNotEmpty({ message: 'Testimonial ID is required' })
  testimonialId: string;
}

export class GetTestimonialsFilterDto {
  @ApiPropertyOptional({ enum: Status })
  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must not exceed 100' })
  limit?: number;
}

export class GetActiveTestimonialsDto {
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  limit?: number;
}
