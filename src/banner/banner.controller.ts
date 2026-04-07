import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto, BannerListDto, DeleteBannerDto } from './dto/banner.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiResponse } from '../common/type/response.type';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  @Post('create')
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Body() createBannerDto: CreateBannerDto,
  ): Promise<ApiResponse> {
    return await this.bannerService.create(
      createBannerDto,
      req,
    );
  }

  @Post('list')
  async findAll(
    @Request() req: any,
    @Body() bannerListDto: BannerListDto
  ): Promise<ApiResponse> {
    return await this.bannerService.findAll(bannerListDto, req);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Body() updateBannerDto: UpdateBannerDto,
  ): Promise<ApiResponse> {
    return await this.bannerService.update(
      updateBannerDto,
      req,
    );
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  async delete(
    @Request() req: any,
    @Body() deleteBannerDto: DeleteBannerDto
  ): Promise<ApiResponse> {
    return await this.bannerService.delete(deleteBannerDto, req);
  }
}
