import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Status } from '../../common/enums/status.enum';

export class CreateSubcategoryDto {
  @IsNotEmpty({ message: 'Subcategory name is required' })
  @IsString({ message: 'Subcategory name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsMongoId({ message: 'Category ID must be a valid MongoDB ID' })
  categoryId: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  image?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;
}

export class UpdateSubcategoryDto {
  @IsNotEmpty({ message: 'Subcategory ID is required' })
  @IsString({ message: 'Subcategory ID must be a string' })
  subcategoryId: string;

  @IsOptional()
  @IsString({ message: 'Subcategory name must be a string' })
  name?: string;

  @IsOptional()
  @IsMongoId({ message: 'Category ID must be a valid MongoDB ID' })
  categoryId?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  image?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;
}

export class GetSubcategoryDto {
  @IsNotEmpty({ message: 'Subcategory ID is required' })
  @IsString({ message: 'Subcategory ID must be a string' })
  subcategoryId: string;
}

export class ListSubcategoryDto {
  @IsOptional()
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must not exceed 100' })
  limit?: number;

  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: Status;

  @IsOptional()
  @IsMongoId({ message: 'Category ID must be a valid MongoDB ID' })
  categoryId?: string;
}

export class DeleteSubcategoryDto {
  @IsNotEmpty({ message: 'Subcategory ID is required' })
  @IsString({ message: 'Subcategory ID must be a string' })
  subcategoryId: string;
}

export class GetActiveSubcategoriesDto {
  @IsOptional()
  @IsMongoId({ message: 'Category ID must be a valid MongoDB ID' })
  categoryId?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  limit?: number;
}
