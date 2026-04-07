import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContactDto {
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() email?: string;
}

class AgentDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsString() designation?: string;
  @IsOptional() @IsString() bio?: string;
}

class AgencyDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() @IsString() license?: string;
  @IsOptional() @IsString() experience?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() hours?: string;
  @IsOptional() @IsString() mapUrl?: string;
}

class SocialLinksDto {
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() twitter?: string;
  @IsOptional() @IsString() youtube?: string;
}

class SeoDto {
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDescription?: string;
  @IsOptional() @IsString() metaKeywords?: string;
  @IsOptional() @IsString() ogTitle?: string;
  @IsOptional() @IsString() ogDescription?: string;
  @IsOptional() @IsString() ogImage?: string;
  @IsOptional() @IsString() canonicalUrl?: string;
}

class FaqDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() a?: string;
}

class TestimonialDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsString() role?: string;
}

export class CreateLandingPageDto {
  @IsNotEmpty() @IsString() categoryId: string;
  @IsNotEmpty() @IsString() slug: string;
  @IsNotEmpty() @IsString() title: string;
  @IsOptional() @IsArray() @IsString({ each: true }) heroBanners?: string[];
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;

  @IsOptional() @ValidateNested() @Type(() => ContactDto) contact?: ContactDto;
  @IsOptional() @ValidateNested() @Type(() => AgentDto) agent?: AgentDto;
  @IsOptional() @ValidateNested() @Type(() => AgencyDto) agency?: AgencyDto;
  @IsOptional() @ValidateNested() @Type(() => SocialLinksDto) socialLinks?: SocialLinksDto;
  @IsOptional() @ValidateNested() @Type(() => SeoDto) seo?: SeoDto;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => FaqDto) faqs?: FaqDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => TestimonialDto) testimonials?: TestimonialDto[];
  @IsOptional() @IsArray() @IsString({ each: true }) destinations?: string[];
}

export class UpdateLandingPageDto extends CreateLandingPageDto {
  @IsNotEmpty() @IsString() landingPageId: string;
}
