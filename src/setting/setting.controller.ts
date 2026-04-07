import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto, GetSettingDto } from './dto/setting.dto';
import { ApiResponse } from '../common/type/response.type';
import { AuthGuard } from '../guards/auth.guard';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) { }

  @Post('create')
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Body() createSettingDto: CreateSettingDto,
  ): Promise<ApiResponse> {
    return await this.settingService.create(createSettingDto, req);
  }

  @Post('get')
  @UseGuards(AuthGuard)
  async get(
    @Request() req: any,
    @Body() getSettingDto: GetSettingDto
  ): Promise<ApiResponse> {
    return await this.settingService.get(getSettingDto, req);
  }

  @Post('public/get')
  async getPublic(
    @Body() getSettingDto: GetSettingDto
  ): Promise<ApiResponse> {
    return await this.settingService.get(getSettingDto, null);
  }
}
