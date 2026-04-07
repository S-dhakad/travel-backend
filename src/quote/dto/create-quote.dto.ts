import { IsNotEmpty, IsString, IsEmail, IsOptional, IsObject } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  departureCity: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsObject()
  systemInfo: Record<string, any>;

  @IsOptional()
  @IsObject()
  locationInfo: Record<string, any>;

  @IsOptional()
  @IsString()
  sourceLandingPage: string;
}
