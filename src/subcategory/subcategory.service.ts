import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subcategory, SubcategoryDocument } from './schemas/subcategory.schema';
import { Category } from '../category/schemas/category.schema';
import { CreateSubcategoryDto, UpdateSubcategoryDto, ListSubcategoryDto, GetSubcategoryDto, DeleteSubcategoryDto, GetActiveSubcategoriesDto } from './dto/subcategory.dto';
import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/type/response.type';
import { Status } from '../common/enums/status.enum';

@Injectable()
export class SubcategoryService {

  constructor(
    @InjectModel(Subcategory.name)
    private subcategoryModel: Model<SubcategoryDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
    private responseService: ResponseService,
  ) { }

  async getActiveSubcategories(getActiveDto: GetActiveSubcategoriesDto, req: any): Promise<ApiResponse> {
    const { categoryId, limit } = getActiveDto;
    try {
      const query: any = { status: Status.ACTIVE };
      if (categoryId) {
        query.categoryId = new Types.ObjectId(categoryId);
      }

      let subcategoriesQuery = this.subcategoryModel
        .find(query)
        .populate('categoryId', 'name')
        .select('-__v')
        .sort({ name: 1 });

      if (limit) {
        subcategoriesQuery = subcategoriesQuery.limit(limit);
      }

      const subcategories = await subcategoriesQuery.exec();
      return this.responseService.success('Active subcategories retrieved successfully', subcategories);
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve active subcategories', error.message);
    }
  }

  async create(createSubcategoryDto: CreateSubcategoryDto, req: any): Promise<ApiResponse> {
    const { name, categoryId, description, image, status } = createSubcategoryDto;
    const { userId } = req.user;

    // Validate category exists
    const category = await this.categoryModel.findById(categoryId).exec();
    if (!category) {
      return this.responseService.notFound('Category not found');
    }

    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    // Check if subcategory with same name/slug in same category already exists
    // (Actually user requested unique uske name se, so I'll check global uniqueness for slug)
    const existingSubcategory = await this.subcategoryModel
      .findOne({ $or: [{ name, categoryId: new Types.ObjectId(categoryId) }, { slug }] })
      .exec();
    if (existingSubcategory) {
      if (existingSubcategory.slug === slug) {
        return this.responseService.badRequest('Subcategory with this slug (name) already exists');
      }
      return this.responseService.badRequest('Subcategory with this name already exists in this category');
    }

    const subcategory = new this.subcategoryModel({
      name,
      slug,
      categoryId: new Types.ObjectId(categoryId),
      description,
      image,
      status: status || Status.ACTIVE,
      createBy: new Types.ObjectId(userId),
    });

    await subcategory.save();

    return this.responseService.created('Subcategory created successfully', {
      subcategoryId: subcategory._id.toString(),
      name: subcategory.name,
      slug: subcategory.slug,
      categoryId: subcategory.categoryId.toString(),
      description: subcategory.description,
      image: subcategory.image,
      status: subcategory.status,
      createBy: subcategory.createBy?.toString(),
    });
  }

  async findAll(listSubcategoryDto: ListSubcategoryDto, req: any): Promise<ApiResponse> {
    const { page = 1, limit = 10, search, status, categoryId } = listSubcategoryDto;
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery: any = {};

    if (status) {
      searchQuery.status = status;
    }

    if (categoryId) {
      searchQuery.categoryId = new Types.ObjectId(categoryId);
    }

    // Add search across all fields if search term is provided
    if (search && search.trim()) {
      searchQuery.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const [subcategories, total] = await Promise.all([
      this.subcategoryModel
        .find(searchQuery)
        .populate('categoryId', 'name description image')
        .populate('createBy', 'fullName email mobileNumber')
        .populate('updatedBy', 'fullName email mobileNumber')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.subcategoryModel.countDocuments(searchQuery).exec(),
    ]);

    return this.responseService.success('Subcategories retrieved successfully', {
      subcategories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
      search: search || undefined,
      categoryId: categoryId || undefined,
    });
  }

  async findOne(getSubcategoryDto: GetSubcategoryDto, req: any): Promise<ApiResponse> {
    const { subcategoryId } = getSubcategoryDto;
    const subcategory = await this.subcategoryModel
      .findById(subcategoryId)
      .populate('categoryId', 'name description image')
      .populate('createBy', 'fullName email mobileNumber')
      .populate('updatedBy', 'fullName email mobileNumber')
      .exec();

    if (!subcategory) {
      return this.responseService.notFound('Subcategory not found');
    }

    return this.responseService.success('Subcategory retrieved successfully', {
      subcategoryId: subcategory._id.toString(),
      name: subcategory.name,
      slug: subcategory.slug,
      categoryId: subcategory.categoryId.toString(),
      category: subcategory.categoryId
        ? {
          categoryId: (subcategory.categoryId as any)._id?.toString(),
          name: (subcategory.categoryId as any).name,
          description: (subcategory.categoryId as any).description,
          image: (subcategory.categoryId as any).image,
        }
        : null,
      description: subcategory.description,
      image: subcategory.image,
      status: subcategory.status,
      createBy: subcategory.createBy
        ? {
          userId: (subcategory.createBy as any)._id?.toString(),
          fullName: (subcategory.createBy as any).fullName,
          email: (subcategory.createBy as any).email,
          mobileNumber: (subcategory.createBy as any).mobileNumber,
        }
        : null,
      updatedBy: subcategory.updatedBy
        ? {
          userId: (subcategory.updatedBy as any)._id?.toString(),
          fullName: (subcategory.updatedBy as any).fullName,
          email: (subcategory.updatedBy as any).email,
          mobileNumber: (subcategory.updatedBy as any).mobileNumber,
        }
        : null,
    });
  }

  async update(updateSubcategoryDto: UpdateSubcategoryDto, req: any): Promise<ApiResponse> {
    const { subcategoryId, ...updateData } = updateSubcategoryDto;
    const { userId } = req.user;
    const subcategory = await this.subcategoryModel.findById(subcategoryId).exec();

    if (!subcategory) {
      return this.responseService.notFound('Subcategory not found');
    }

    // Validate category if being updated
    if (updateData.categoryId) {
      const category = await this.categoryModel
        .findById(updateData.categoryId)
        .exec();
      if (!category) {
        return this.responseService.notFound('Category not found');
      }
    }

    // Check if name is being updated and if it's unique within category
    const categoryIdToCheck = updateData.categoryId
      ? new Types.ObjectId(updateData.categoryId)
      : subcategory.categoryId;

    const finalUpdateData: any = { 
        ...updateData,
        updatedBy: new Types.ObjectId(userId)
    };

    if (updateData.name && updateData.name !== subcategory.name) {
      const slug = updateData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      const existingSubcategory = await this.subcategoryModel
        .findOne({
          $or: [{ name: updateData.name, categoryId: categoryIdToCheck }, { slug }],
          _id: { $ne: subcategoryId },
        })
        .exec();
      if (existingSubcategory) {
        if (existingSubcategory.slug === slug) {
          return this.responseService.badRequest('Subcategory with this slug (name) already exists');
        }
        return this.responseService.badRequest('Subcategory with this name already exists in this category');
      }
      finalUpdateData.name = updateData.name;
      finalUpdateData.slug = slug;
    }

    if (updateData.categoryId) {
        finalUpdateData.categoryId = new Types.ObjectId(updateData.categoryId);
    }

    const updatedSubcategory = await this.subcategoryModel.findByIdAndUpdate(
        subcategoryId,
        { $set: finalUpdateData },
        { new: true }
    ).exec();

    if (!updatedSubcategory) {
      return this.responseService.error('Failed to update subcategory');
    }

    return this.responseService.success('Subcategory updated successfully', {
      subcategoryId: updatedSubcategory._id.toString(),
      name: updatedSubcategory.name,
      categoryId: updatedSubcategory.categoryId.toString(),
      description: updatedSubcategory.description,
      image: updatedSubcategory.image,
      status: updatedSubcategory.status,
      updatedBy: updatedSubcategory.updatedBy?.toString(),
    });
  }

  async delete(deleteSubcategoryDto: DeleteSubcategoryDto, req: any): Promise<ApiResponse> {
    const { subcategoryId } = deleteSubcategoryDto;
    const subcategory = await this.subcategoryModel.findById(subcategoryId).exec();

    if (!subcategory) {
      return this.responseService.notFound('Subcategory not found');
    }

    await this.subcategoryModel.findByIdAndDelete(subcategoryId).exec();

    return this.responseService.success('Subcategory deleted successfully', {
      subcategoryId: subcategory._id.toString(),
      name: subcategory.name,
    });
  }
}
