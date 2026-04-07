
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsBoolean, IsEnum, Min, Max, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from '../../common/enums/status.enum';

class ItineraryDetailDto {
  @IsNumber()
  @Min(1)
  day: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

class HotelDetailDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  starRating?: number;

  @IsOptional()
  @IsNumber()
  nights?: number;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsString()
  mealPlan?: string;
}

export class CreatePackageDto {
  @IsNotEmpty({ message: 'Package name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsMongoId()
  subcategoryId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountedPrice?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  durationDays: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  durationNights: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  overview?: string;

  @IsOptional()
  @IsString()
  packageType?: string;

  @IsOptional()
  @IsString()
  pickupPoint?: string;

  @IsOptional()
  @IsString()
  dropoffPoint?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxGuests?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  packageRating?: number;

  @IsOptional()
  @IsString()
  departureCity?: string;

  @IsOptional()
  @IsString()
  transportMode?: string;

  @IsOptional()
  @IsString()
  transportDetails?: string;

  @IsOptional()
  @IsBoolean()
  visaIncluded?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAge?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAge?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelDetailDto)
  hotels?: HotelDetailDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDetailDto)
  itinerary?: ItineraryDetailDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inclusions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @IsOptional()
  @IsString()
  usefulInfo?: string;

  @IsOptional()
  @IsString()
  termsCondition?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsBoolean()
  isBestSelling?: boolean;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;
}

export class UpdatePackageDto extends CreatePackageDto {
  @IsNotEmpty({ message: 'Package ID is required' })
  @IsMongoId()
  packageId: string;
}

export class ListPackageDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsMongoId()
  subcategoryId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isBestSelling?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPopular?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cities?: string[];

  @IsOptional()
  @IsArray()
  stars?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minDuration?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxDuration?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;
}

export class GetPackageDto {
  @IsOptional()
  @IsMongoId()
  packageId?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}

export class DeletePackageDto {
  @IsNotEmpty({ message: 'Package ID is required' })
  @IsMongoId()
  packageId: string;
}
