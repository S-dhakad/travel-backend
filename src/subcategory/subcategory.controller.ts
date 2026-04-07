import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import {
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
  GetSubcategoryDto,
  ListSubcategoryDto,
  DeleteSubcategoryDto,
} from './dto/subcategory.dto';
import { ApiResponse } from '../common/type/response.type';
import { AuthGuard } from '../guards/auth.guard';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) { }

  @Post('create')
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<ApiResponse> {
    return await this.subcategoryService.create(createSubcategoryDto, req);
  }

  @Post('list')
  async findAll(
    @Request() req: any,
    @Body() listSubcategoryDto: ListSubcategoryDto
  ): Promise<ApiResponse> {
    return await this.subcategoryService.findAll(listSubcategoryDto, req);
  }

  @Post('get')
  @UseGuards(AuthGuard)
  async findOne(
    @Request() req: any,
    @Body() getSubcategoryDto: GetSubcategoryDto
  ): Promise<ApiResponse> {
    return await this.subcategoryService.findOne(getSubcategoryDto, req);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<ApiResponse> {
    return await this.subcategoryService.update(updateSubcategoryDto, req);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  async delete(
    @Request() req: any,
    @Body() deleteSubcategoryDto: DeleteSubcategoryDto
  ): Promise<ApiResponse> {
    return await this.subcategoryService.delete(deleteSubcategoryDto, req);
  }
}
