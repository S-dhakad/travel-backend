import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteListDto, DeleteQuoteDto } from './dto/quote.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiResponse } from '../common/type/response.type';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) { }

  @Post('create')
  async create(
    @Req() req: Request,
    @Body() createQuoteDto: CreateQuoteDto,
  ): Promise<ApiResponse> {
    // Middleware already parsed and attached these to req
    createQuoteDto.systemInfo = req['systemInfo'];
    createQuoteDto.locationInfo = req['locationInfo'];
    
    return await this.quoteService.create(createQuoteDto);
  }

  @Post('list')
  @UseGuards(AuthGuard)
  async findAll(
    @Body() quoteListDto: QuoteListDto
  ): Promise<ApiResponse> {
    return await this.quoteService.findAll(quoteListDto);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  async delete(
    @Body() deleteQuoteDto: DeleteQuoteDto
  ): Promise<ApiResponse> {
    return await this.quoteService.delete(deleteQuoteDto);
  }
}
