import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum LegalContentType {
    PRIVACY = 'privacyPolicy',
    TERMS = 'termsAndConditions',
    ABOUT = 'aboutUs',
    ALL = 'all'
}

export class GetLegalDto {
    @IsOptional()
    @IsEnum(LegalContentType)
    type?: LegalContentType;
}

export class UpdateLegalDto {
    @IsOptional()
    @IsString()
    privacyPolicy?: string;

    @IsOptional()
    @IsString()
    termsAndConditions?: string;

    @IsOptional()
    @IsString()
    aboutUs?: string;
}
