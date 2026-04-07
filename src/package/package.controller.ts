
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto, UpdatePackageDto, ListPackageDto, GetPackageDto, DeletePackageDto } from './dto/package.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiResponse } from '../common/type/response.type';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) { }

  @Post('create')
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Body() createPackageDto: CreatePackageDto,
  ): Promise<ApiResponse> {
    return await this.packageService.create(createPackageDto, req);
  }

  @Post('list')
  async findAll(
    @Request() req: any,
    @Body() listPackageDto: ListPackageDto
  ): Promise<ApiResponse> {
    return await this.packageService.findAll(listPackageDto, req);
  }

  @Post('get')
  async findOne(
    @Request() req: any,
    @Body() getPackageDto: GetPackageDto
  ): Promise<ApiResponse> {
    return await this.packageService.findOne(getPackageDto, req);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Body() updatePackageDto: UpdatePackageDto,
  ): Promise<ApiResponse> {
    return await this.packageService.update(updatePackageDto, req);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  async delete(
    @Request() req: any,
    @Body() deletePackageDto: DeletePackageDto
  ): Promise<ApiResponse> {
    return await this.packageService.delete(deletePackageDto, req);
  }

  @Post('counts')
  async getCounts(
    @Request() req: any
  ): Promise<ApiResponse> {
    return await this.packageService.getCounts(req);
  }
}
