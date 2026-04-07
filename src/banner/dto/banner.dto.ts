import { IsString, IsNumber, IsOptional, IsMongoId, IsNotEmpty, IsEnum, Min, Max } from 'class-validator';
import { Status } from '../../common/enums/status.enum';

export class CreateBannerDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Image is required' })
  @IsString({ message: 'Image must be a string' })
  image: string;


  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;
}

export class UpdateBannerDto {
  @IsNotEmpty({ message: 'Banner ID is required' })
  @IsMongoId({ message: 'Banner ID must be a valid MongoDB ID' })
  bannerId: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string;


  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;
}

export class GetActiveBannersDto {
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  limit?: number;
}

export class BannerListDto {
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;

  @IsOptional()
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number;
}

export class DeleteBannerDto {
  @IsNotEmpty({ message: 'Banner ID is required' })
  @IsMongoId({ message: 'Banner ID must be a valid MongoDB ID' })
  bannerId: string;
}
