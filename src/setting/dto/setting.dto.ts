import {
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';

export class CreateSettingDto {
  @IsOptional()
  @IsString()
  siteName?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsString()
  supportWhatsapp?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid support email format' })
  supportEmail?: string;
}

export class UpdateSettingDto {
  @IsOptional()
  @IsString()
  siteName?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsString()
  supportWhatsapp?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid support email format' })
  supportEmail?: string;
}

export class GetSettingByIdDto {
  @IsOptional()
  @IsString()
  id: string;
}

export class GetSettingDto { }
