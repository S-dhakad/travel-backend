import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Package, PackageDocument } from '../package/schemas/package.schema';
import { LandingPage, LandingPageDocument } from './schemas/landing-page.schema';
import { CreateCategoryDto, UpdateCategoryDto, CategoryListDto, GetCategoryDto, DeleteCategoryDto, GetActiveCategoriesDto } from './dto/category.dto';
import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/type/response.type';
import { Status } from '../common/enums/status.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @InjectModel(Package.name)
    private packageModel: Model<PackageDocument>,
    @InjectModel(LandingPage.name)
    private landingPageModel: Model<LandingPageDocument>,
    private responseService: ResponseService,
  ) { }

  async getActiveCategories(getActiveCategoriesDto: GetActiveCategoriesDto, req: any): Promise<ApiResponse> {
    const { limit } = getActiveCategoriesDto;
    try {
      let query = this.categoryModel.find({ status: Status.ACTIVE }).select('-__v').sort({ createdAt: -1 });

      if (limit) {
        query = query.limit(limit);
      }

      const categories = await query.exec();
      return this.responseService.success('Active categories retrieved successfully', categories);
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve active categories', error.message);
    }
  }

  async create(createCategoryDto: CreateCategoryDto, req: any): Promise<ApiResponse> {
    const { 
      name, description, image, status, 
      landingPageEnabled, landingPageTitle, landingPageDescription, 
      contactPhone, contactWhatsApp, contactEmail, landingPageSlug,
      landingPageFaqs, landingPageTestimonials, seo,
      agentName, agentImage, agentDesignation, businessAddress,
      agencyName, agencyLogo, licenseNumber, experience, destinations,
      socialLinks, businessHours, googleMapUrl
    } = createCategoryDto;
    const { userId } = req.user;

    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    // Check if category with same name or slug already exists
    const existingCategory = await this.categoryModel.findOne({ $or: [{ name }, { slug }] }).exec();
    if (existingCategory) {
      return this.responseService.badRequest('Category with this name or slug already exists');
    }

    const category = new this.categoryModel({
      name,
      slug,
      description,
      image,
      status: status || Status.ACTIVE,
      landingPageEnabled: landingPageEnabled || false,
      createBy: new Types.ObjectId(userId),
    });

    await category.save();

    if (landingPageEnabled) {
      const landingPage = new this.landingPageModel({
        categoryId: category._id,
        slug: landingPageSlug || slug,
        title: landingPageTitle,
        description: landingPageDescription,
        contactPhone,
        contactWhatsApp,
        contactEmail,
        agentName,
        agentImage,
        agentDesignation,
        businessAddress,
        agencyName,
        agencyLogo,
        licenseNumber,
        experience,
        destinations,
        socialLinks,
        businessHours,
        googleMapUrl,
        faqs: landingPageFaqs || [],
        testimonials: landingPageTestimonials || [],
        seo,
      });
      await landingPage.save();
    }

    return this.responseService.created('Category created successfully', category);
  }

  async findAll(categoryListDto: CategoryListDto, req: any): Promise<ApiResponse> {
    const { page = 1, limit = 10, search, status } = categoryListDto;
    const { user } = req;
    const skip = (page - 1) * limit;

    // Build search query if search term is provided
    const searchQuery: any = {};
    if (status !== undefined) {
      searchQuery.status = status;
    }
    if (search && search.trim()) {
      searchQuery.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const [categories, total] = await Promise.all([
      this.categoryModel
        .find(searchQuery)
        .populate('createBy', 'fullName email mobileNumber')
        .populate('updatedBy', 'fullName email mobileNumber')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.categoryModel.countDocuments(searchQuery).exec(),
    ]);

    return this.responseService.success('Categories retrieved successfully', {
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
      search: search || undefined,
    });
  }

  async findOne(getCategoryDto: GetCategoryDto, req: any): Promise<ApiResponse> {
    const { categoryId } = getCategoryDto;
    const category = await this.categoryModel
      .findById(categoryId)
      .populate('createBy', 'fullName email mobileNumber')
      .populate('updatedBy', 'fullName email mobileNumber')
      .exec();

    if (!category) {
      return this.responseService.notFound('Category not found');
    }

    const landingPage = await this.landingPageModel.findOne({ categoryId }).exec();

    return this.responseService.success('Category retrieved successfully', {
      ...category.toObject(),
      categoryId: category._id.toString(),
      landingPageData: landingPage,
    });
  }

  async update(updateCategoryDto: UpdateCategoryDto, req: any): Promise<ApiResponse> {
    const { categoryId, ...updateData } = updateCategoryDto;
    const { userId } = req.user;
    const category = await this.categoryModel.findById(categoryId).exec();

    if (!category) {
      return this.responseService.notFound('Category not found');
    }

    // Check if name is being updated and if it's unique
    if (updateData.name && updateData.name !== category.name) {
      const slug = updateData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      const existingCategory = await this.categoryModel
        .findOne({ $or: [{ name: updateData.name }, { slug }], _id: { $ne: categoryId } })
        .exec();
      if (existingCategory) {
        return this.responseService.badRequest('Category with this name or slug already exists');
      }
      category.name = updateData.name;
      category.slug = slug;
    }

    // Update other fields
    if (updateData.description !== undefined) category.description = updateData.description;
    if (updateData.image !== undefined) category.image = updateData.image;
    if (updateData.status !== undefined) category.status = updateData.status as any;
    
    // Landing page fields update
    if (updateData.landingPageEnabled !== undefined) category.landingPageEnabled = updateData.landingPageEnabled;
    
    if (category.landingPageEnabled) {
      await this.landingPageModel.findOneAndUpdate(
        { categoryId },
        {
          slug: updateData.landingPageSlug,
          title: updateData.landingPageTitle,
          description: updateData.landingPageDescription,
          contactPhone: updateData.contactPhone,
          contactWhatsApp: updateData.contactWhatsApp,
          contactEmail: updateData.contactEmail,
          agentName: updateData.agentName,
          agentImage: updateData.agentImage,
          agentDesignation: updateData.agentDesignation,
          businessAddress: updateData.businessAddress,
          agencyName: updateData.agencyName,
          agencyLogo: updateData.agencyLogo,
          licenseNumber: updateData.licenseNumber,
          experience: updateData.experience,
          destinations: updateData.destinations,
          socialLinks: updateData.socialLinks,
          businessHours: updateData.businessHours,
          googleMapUrl: updateData.googleMapUrl,
          faqs: updateData.landingPageFaqs,
          testimonials: updateData.landingPageTestimonials,
          seo: updateData.seo,
        },
        { upsert: true, new: true }
      );
    }

    category.updatedBy = new Types.ObjectId(userId);
    await category.save();

    return this.responseService.success('Category updated successfully', category);
  }

  async delete(deleteCategoryDto: DeleteCategoryDto, req: any): Promise<ApiResponse> {
    const { categoryId } = deleteCategoryDto;
    const category = await this.categoryModel.findById(categoryId).exec();

    if (!category) {
      return this.responseService.notFound('Category not found');
    }

    await this.categoryModel.findByIdAndDelete(categoryId).exec();

    return this.responseService.success('Category deleted successfully', {
      categoryId: category._id.toString(),
      name: category.name,
    });
  }

  async getLandingPage(slug: string): Promise<ApiResponse> {
    try {
      const landingPage = await this.landingPageModel.findOne({ 
        slug: slug, 
        isActive: true 
      }).exec();

      if (!landingPage) {
        return this.responseService.notFound('Landing page not found');
      }

      const category = await this.categoryModel.findById(landingPage.categoryId).exec();
      if (!category || category.status !== Status.ACTIVE || !category.landingPageEnabled) {
        return this.responseService.notFound('Landing page is disabled');
      }

      const packages = await this.packageModel.find({ 
        categoryId: category._id,
        status: Status.ACTIVE
      }).sort({ isBestSelling: -1, isPopular: -1, createdAt: -1 }).exec();

      return this.responseService.success('Landing page data retrieved successfully', {
        category,
        landingPage,
        packages
      });
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve landing page data', error.message);
    }
  }
}
