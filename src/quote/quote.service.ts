import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote, QuoteDocument } from './schemas/quote.schema';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteListDto, DeleteQuoteDto } from './dto/quote.dto';
import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/type/response.type';

@Injectable()
export class QuoteService {
  constructor(
    @InjectModel(Quote.name)
    private quoteModel: Model<QuoteDocument>,
    private responseService: ResponseService,
  ) {}

  async create(createQuoteDto: CreateQuoteDto): Promise<ApiResponse> {
    try {
      const quote = new this.quoteModel(createQuoteDto);
      await quote.save();
      return this.responseService.created('Quote request submitted successfully', quote);
    } catch (error: any) {
      return this.responseService.error('Failed to submit quote request', error.message);
    }
  }

  async findAll(quoteListDto: any): Promise<ApiResponse> {
    const { page = 1, limit = 10, search, startDate, endDate } = quoteListDto;
    const skip = (page - 1) * limit;

    let searchQuery: any = {};
    if (search && search.trim()) {
      searchQuery.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { destination: { $regex: search.trim(), $options: 'i' } },
        { departureCity: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      searchQuery.createdAt = {};
      if (startDate) searchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) searchQuery.createdAt.$lte = new Date(endDate);
    }

    const [quotes, total] = await Promise.all([
      this.quoteModel
        .find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.quoteModel.countDocuments(searchQuery).exec(),
    ]);

    return this.responseService.success('Quotes retrieved successfully', {
      quotes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    });
  }

  async delete(deleteQuoteDto: DeleteQuoteDto): Promise<ApiResponse> {
    try {
      const { quoteId } = deleteQuoteDto;
      const quote = await this.quoteModel.findByIdAndDelete(quoteId).exec();
      if (!quote) {
        return this.responseService.notFound('Quote not found');
      }
      return this.responseService.success('Quote deleted successfully', quote);
    } catch (error: any) {
      return this.responseService.error('Failed to delete quote', error.message);
    }
  }
}
