import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { CreateLandingPageDto, UpdateLandingPageDto } from './dto/landing-page.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiResponse } from '../common/type/response.type';

@Controller('landing-page')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() createDto: CreateLandingPageDto): Promise<ApiResponse> {
    const data = await this.landingPageService.create(createDto);
    return { success: true, message: 'Landing page created successfully', data };
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(@Body() updateDto: UpdateLandingPageDto): Promise<ApiResponse> {
    const data = await this.landingPageService.update(updateDto);
    return { success: true, message: 'Landing page updated successfully', data };
  }

  @Post('get')
  async getByCategoryId(@Body('categoryId') categoryId: string): Promise<ApiResponse> {
    const data = await this.landingPageService.getByCategoryId(categoryId);
    return { success: true, message: 'Success', data };
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string): Promise<ApiResponse> {
    const data = await this.landingPageService.getBySlug(slug);
    return { success: true, message: 'Success', data };
  }

  @Post('list')
  @UseGuards(AuthGuard)
  async listAll(): Promise<ApiResponse> {
    const data = await this.landingPageService.listAll();
    return { success: true, message: 'Success', data };
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return await this.landingPageService.delete(id);
  }
}
