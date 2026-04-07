import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LandingPage, LandingPageDocument } from './schemas/landing-page.schema';
import { CreateLandingPageDto, UpdateLandingPageDto } from './dto/landing-page.dto';

@Injectable()
export class LandingPageService {
  constructor(
    @InjectModel(LandingPage.name) private landingPageModel: Model<LandingPageDocument>,
  ) {}

  async create(createDto: CreateLandingPageDto): Promise<LandingPage> {
    try {
      const { categoryId, slug } = createDto;

      // Check if category already has a landing page
      const existing = await this.landingPageModel.findOne({ categoryId: new Types.ObjectId(categoryId) });
      if (existing) throw new ConflictException('Landing page already exists for this category');

      // Check slug uniqueness
      const existingSlug = await this.landingPageModel.findOne({ slug });
      if (existingSlug) throw new ConflictException('Slug already in use');

      const created = new this.landingPageModel({
        ...createDto,
        categoryId: new Types.ObjectId(categoryId),
      });

      return await created.save();
    } catch (error) {
      throw error;
    }
  }

  async update(updateDto: UpdateLandingPageDto): Promise<LandingPage> {
    const { landingPageId, ...updateData } = updateDto;
    
    const updated = await this.landingPageModel.findByIdAndUpdate(
      landingPageId,
      { 
        ...updateData,
        categoryId: new Types.ObjectId(updateData.categoryId)
      },
      { new: true }
    );

    if (!updated) throw new NotFoundException('Landing page not found');
    return updated;
  }

  async getByCategoryId(categoryId: string): Promise<LandingPage> {
    const landingPage = await this.landingPageModel.findOne({ categoryId: new Types.ObjectId(categoryId) });
    if (!landingPage) throw new NotFoundException('Landing page not found for this category');
    return landingPage;
  }

  async getBySlug(slug: string): Promise<LandingPage> {
    const landingPage = await this.landingPageModel.findOne({ slug, isActive: true }).populate('categoryId');
    if (!landingPage) throw new NotFoundException('Landing page not found');
    return landingPage;
  }

  async listAll(): Promise<LandingPage[]> {
    return await this.landingPageModel.find().populate('categoryId').sort({ createdAt: -1 });
  }

  async delete(id: string): Promise<any> {
    const deleted = await this.landingPageModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Landing page not found');
    return { success: true, message: 'Landing page deleted successfully' };
  }
}
