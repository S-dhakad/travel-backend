import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';
import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/type/response.type';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
  GetTestimonialsFilterDto,
  GetTestimonialDto,
  DeleteTestimonialDto,
  GetActiveTestimonialsDto,
} from './dto/testimonial.dto';
import { Status } from '../common/enums/status.enum';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<TestimonialDocument>,
    private responseService: ResponseService,
  ) { }

  async getActiveTestimonials(getActiveDto: GetActiveTestimonialsDto, req: any): Promise<ApiResponse> {
    const { limit } = getActiveDto;
    try {
      let query = this.testimonialModel
        .find({ status: Status.ACTIVE, isDeleted: false })
        .populate('userId', 'fullName mobileNumber email')
        .populate('createdBy', 'fullName')
        .select('-__v')
        .sort({ createdAt: -1 });

      if (limit) {
        query = query.limit(limit);
      }

      const testimonials = await query.exec();
      return this.responseService.success('Active testimonials retrieved successfully', testimonials);
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve active testimonials', error.message);
    }
  }

  async create(createTestimonialDto: CreateTestimonialDto, req: any): Promise<ApiResponse> {
    const { userId } = req.user;
    try {
      const testimonial = new this.testimonialModel({
        ...createTestimonialDto,
        userId: new Types.ObjectId(userId),
        createdBy: new Types.ObjectId(userId),
      });

      const savedTestimonial = await testimonial.save();

      return this.responseService.created('Testimonial created successfully', savedTestimonial);
    } catch (error: any) {
      return this.responseService.error('Failed to create testimonial', error.message);
    }
  }

  async findAll(filterDto: GetTestimonialsFilterDto, req: any): Promise<ApiResponse> {
    try {
      const { page = 1, limit = 10, status, search } = filterDto;
      const skip = (page - 1) * limit;

      const query: any = { isDeleted: false };
      if (status) query.status = status;

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }

      const [testimonials, total] = await Promise.all([
        this.testimonialModel
          .find(query)
          .populate('createdBy', 'name email')
          .populate('updatedBy', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.testimonialModel.countDocuments(query).exec(),
      ]);

      return this.responseService.success('Testimonials retrieved successfully', {
        testimonials,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve testimonials', error.message);
    }
  }

  async findOne(getTestimonialDto: GetTestimonialDto, req: any): Promise<ApiResponse> {
    const { testimonialId } = getTestimonialDto;
    try {
      const testimonial = await this.testimonialModel
        .findOne({ _id: new Types.ObjectId(testimonialId), isDeleted: false })
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .exec();

      if (!testimonial) {
        return this.responseService.notFound('Testimonial not found');
      }

      return this.responseService.success('Testimonial retrieved successfully', testimonial);
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve testimonial', error.message);
    }
  }

  async update(updateTestimonialDto: UpdateTestimonialDto, req: any): Promise<ApiResponse> {
    const { testimonialId, ...updateData } = updateTestimonialDto;
    const { userId } = req.user;
    try {
      const testimonial = await this.testimonialModel.findOneAndUpdate(
        { _id: new Types.ObjectId(testimonialId), isDeleted: false },
        {
          ...updateData,
          updatedBy: new Types.ObjectId(userId),
        },
        { new: true },
      );

      if (!testimonial) {
        return this.responseService.notFound('Testimonial not found');
      }

      return this.responseService.success('Testimonial updated successfully', testimonial);
    } catch (error: any) {
      return this.responseService.error('Failed to update testimonial', error.message);
    }
  }

  async delete(deleteTestimonialDto: DeleteTestimonialDto, req: any): Promise<ApiResponse> {
    const { testimonialId } = deleteTestimonialDto;
    const { userId } = req.user;
    try {
      const testimonial = await this.testimonialModel.findOneAndUpdate(
        { _id: new Types.ObjectId(testimonialId), isDeleted: false },
        { isDeleted: true, updatedBy: new Types.ObjectId(userId) },
        { new: true },
      );

      if (!testimonial) {
        return this.responseService.notFound('Testimonial not found');
      }

      return this.responseService.success('Testimonial deleted successfully');
    } catch (error: any) {
      return this.responseService.error('Failed to delete testimonial', error.message);
    }
  }
}
