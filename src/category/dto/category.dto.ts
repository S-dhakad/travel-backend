import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinksDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  youtube?: string;
}

export class SeoDto {
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @IsOptional()
  @IsString()
  ogTitle?: string;

  @IsOptional()
  @IsString()
  ogDescription?: string;

  @IsOptional()
  @IsString()
  ogImage?: string;

  @IsOptional()
  @IsString()
  canonicalUrl?: string;
}

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString({ message: 'Category name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  image?: string;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  status?: string;

  @IsOptional()
  @IsBoolean({ message: 'Landing page enabled must be a boolean' })
  landingPageEnabled?: boolean;

  @IsOptional()
  @IsString({ message: 'Landing page title must be a string' })
  landingPageTitle?: string;

  @IsOptional()
  @IsString({ message: 'Landing page description must be a string' })
  landingPageDescription?: string;

  @IsOptional()
  @IsString({ message: 'Contact phone must be a string' })
  contactPhone?: string;

  @IsOptional()
  @IsString({ message: 'Contact WhatsApp must be a string' })
  contactWhatsApp?: string;

  @IsOptional()
  @IsString({ message: 'Contact email must be a string' })
  contactEmail?: string;

  @IsOptional()
  @IsString()
  agentName?: string;

  @IsOptional()
  @IsString()
  agentImage?: string;

  @IsOptional()
  @IsString()
  agentDesignation?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsString()
  agencyName?: string;

  @IsOptional()
  @IsString()
  agencyLogo?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  destinations?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsString()
  businessHours?: string;

  @IsOptional()
  @IsString()
  googleMapUrl?: string;

  @IsOptional()
  @IsString({ message: 'Landing page slug must be a string' })
  landingPageSlug?: string;

  @IsOptional()
  @IsArray({ message: 'Landing page FAQs must be an array' })
  landingPageFaqs?: { q: string; a: string }[];

  @IsOptional()
  @IsArray({ message: 'Landing page Testimonials must be an array' })
  landingPageTestimonials?: { name: string; text: string; role: string }[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto;
}

export class UpdateCategoryDto {
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsString({ message: 'Category ID must be a string' })
  categoryId: string;

  @IsOptional()
  @IsString({ message: 'Category name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  image?: string;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  status?: string;

  @IsOptional()
  @IsBoolean({ message: 'Landing page enabled must be a boolean' })
  landingPageEnabled?: boolean;

  @IsOptional()
  @IsString({ message: 'Landing page title must be a string' })
  landingPageTitle?: string;

  @IsOptional()
  @IsString({ message: 'Landing page description must be a string' })
  landingPageDescription?: string;

  @IsOptional()
  @IsString({ message: 'Contact phone must be a string' })
  contactPhone?: string;

  @IsOptional()
  @IsString({ message: 'Contact WhatsApp must be a string' })
  contactWhatsApp?: string;

  @IsOptional()
  @IsString({ message: 'Contact email must be a string' })
  contactEmail?: string;

  @IsOptional()
  @IsString()
  agentName?: string;

  @IsOptional()
  @IsString()
  agentImage?: string;

  @IsOptional()
  @IsString()
  agentDesignation?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsString()
  agencyName?: string;

  @IsOptional()
  @IsString()
  agencyLogo?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  destinations?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsString()
  businessHours?: string;

  @IsOptional()
  @IsString()
  googleMapUrl?: string;

  @IsOptional()
  @IsString({ message: 'Landing page slug must be a string' })
  landingPageSlug?: string;

  @IsOptional()
  @IsArray({ message: 'Landing page FAQs must be an array' })
  landingPageFaqs?: { q: string; a: string }[];

  @IsOptional()
  @IsArray({ message: 'Landing page Testimonials must be an array' })
  landingPageTestimonials?: { name: string; text: string; role: string }[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto;
}

export class GetCategoryDto {
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsString({ message: 'Category ID must be a string' })
  categoryId: string;
}

export class DeleteCategoryDto {
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsString({ message: 'Category ID must be a string' })
  categoryId: string;
}

export class CategoryListDto {
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
  @IsString({ message: 'Status must be a string' })
  status?: string;
}

export class GetActiveCategoriesDto {
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  limit?: number;
}
