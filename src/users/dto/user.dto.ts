import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  Length,
  IsNumber,
  Min,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsObject,
  IsDateString,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, Gender } from '../enums/user-role.enum';

export class LocationDto {
  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  lat?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  lng?: number;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'State must be a string' })
  state?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Pincode must be a string' })
  pincode?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Radius must be a number' })
  radius?: number;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString({ message: 'Mobile number must be a string' })
  @Matches(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    {
      message: 'Please provide a valid mobile number',
    },
  )
  mobileNumber: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  fullName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;

  @IsOptional()
  @IsEnum(Gender, {
    message: `Gender must be one of: ${Object.values(Gender).join(', ')}`,
  })
  gender?: Gender;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date string (YYYY-MM-DD)' })
  dob?: string;

  @IsOptional()
  @IsString({ message: 'Profile image must be a string' })
  profileImage?: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsEnum(Gender, {
    message: `Gender must be one of: ${Object.values(Gender).join(', ')}`,
  })
  gender?: Gender;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date string (YYYY-MM-DD)' })
  dob?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Profile image must be a string' })
  profileImage?: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Old password is required' })
  @IsString({ message: 'Old password must be a string' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @Length(6, 20, { message: 'New password must be between 6 and 20 characters' })
  newPassword: string;
}

export class GetProfileDto { }
