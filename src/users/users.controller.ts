import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService } from './users.service';
import {
  RegisterUserDto,
  LoginDto,
  UpdateProfileDto,
  GetProfileDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { ApiResponse } from '../common/type/response.type';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto): Promise<ApiResponse> {
    return await this.usersService.register(registerDto);
  }

  @Post('login')
  async login(@Body() body: any): Promise<ApiResponse> {
    return await this.usersService.login(body);
  }



  @Post('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: any, @Body() getProfileDto: GetProfileDto): Promise<ApiResponse> {
    return await this.usersService.getProfile(getProfileDto, req);
  }

  @Post('profile-update')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ApiResponse> {
    return await this.usersService.updateProfile(updateProfileDto, req);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ApiResponse> {
    return await this.usersService.changePassword(changePasswordDto, req);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB limit
    },
  }))
  async uploadFile(
    @UploadedFile()
    file:
      | {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
      }
      | undefined,
  ): Promise<ApiResponse> {
    return await this.usersService.uploadFile(
      file?.buffer,
      file?.originalname,
      file?.mimetype,
      'images',
    );
  }
}
