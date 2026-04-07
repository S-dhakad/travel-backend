import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryListDto, GetCategoryDto, DeleteCategoryDto } from './dto/category.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiResponse } from '../common/type/response.type';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('create')
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponse> {
    return await this.categoryService.create(createCategoryDto, req);
  }

  @Post('list')
  async findAll(
    @Request() req: any,
    @Body() categoryListDto: CategoryListDto
  ): Promise<ApiResponse> {
    return await this.categoryService.findAll(categoryListDto, req);
  }

  @Post('get')
  @UseGuards(AuthGuard)
  async findOne(
    @Request() req: any,
    @Body() getCategoryDto: GetCategoryDto
  ): Promise<ApiResponse> {
    return await this.categoryService.findOne(getCategoryDto, req);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponse> {
    return await this.categoryService.update(updateCategoryDto, req);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  async delete(
    @Request() req: any,
    @Body() deleteCategoryDto: DeleteCategoryDto
  ): Promise<ApiResponse> {
    return await this.categoryService.delete(deleteCategoryDto, req);
  }

  @Get('landing/:slug')
  async getLandingPage(@Param('slug') slug: string): Promise<ApiResponse> {
    return await this.categoryService.getLandingPage(slug);
  }
}
