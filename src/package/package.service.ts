
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Package, PackageDocument } from './schemas/package.schema';
import { CreatePackageDto, UpdatePackageDto, ListPackageDto, GetPackageDto, DeletePackageDto } from './dto/package.dto';
import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/type/response.type';
import { Status } from '../common/enums/status.enum';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name)
    private packageModel: Model<PackageDocument>,
    private responseService: ResponseService,
  ) { }

  async create(createPackageDto: CreatePackageDto, req: any): Promise<ApiResponse> {
    const { name, ...rest } = createPackageDto;
    const { userId } = req.user;

    // Generate unique slug
    let slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let slugExists = await this.packageModel.findOne({ slug }).exec();
    let counter = 1;
    let originalSlug = slug;
    while (slugExists) {
        slug = `${originalSlug}-${counter}`;
        slugExists = await this.packageModel.findOne({ slug }).exec();
        counter++;
    }

    const newPackage = new this.packageModel({
      ...rest,
      name,
      slug,
      createBy: new Types.ObjectId(userId),
    });

    await newPackage.save();

    return this.responseService.created('Package created successfully', newPackage);
  }

  async findAll(listPackageDto: ListPackageDto, req: any): Promise<ApiResponse> {
    const { page = 1, limit = 10, search, status, categoryId, subcategoryId, isBestSelling, isPopular, tags, cities, stars, minDuration, maxDuration, sortBy } = listPackageDto;
    const skip = (page - 1) * limit;

    const searchQuery: any = {};
    if (status) searchQuery.status = status;
    if (categoryId) searchQuery.categoryId = new Types.ObjectId(categoryId);
    if (subcategoryId) searchQuery.subcategoryId = new Types.ObjectId(subcategoryId);
    if (isBestSelling !== undefined) searchQuery.isBestSelling = isBestSelling;
    if (isPopular !== undefined) searchQuery.isPopular = isPopular;

    if (tags && tags.length > 0) {
        searchQuery.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }

    // Hotel filters (City and Star Rating)
    if ((cities && cities.length > 0) || (stars && stars.length > 0)) {
        const hotelMatch: any = {};
        if (cities && cities.length > 0) hotelMatch.city = { $in: cities };
        if (stars && stars.length > 0) hotelMatch.starRating = { $in: stars.map(Number) };
        searchQuery.hotels = { $elemMatch: hotelMatch };
    }

    // Duration filters
    if (minDuration !== undefined || maxDuration !== undefined) {
        searchQuery.durationNights = {};
        if (minDuration !== undefined) searchQuery.durationNights.$gte = Number(minDuration);
        if (maxDuration !== undefined) searchQuery.durationNights.$lte = Number(maxDuration);
    }

    if (search && search.trim()) {
        searchQuery.$or = [
            { name: { $regex: search.trim(), $options: 'i' } },
            { description: { $regex: search.trim(), $options: 'i' } },
            { location: { $regex: search.trim(), $options: 'i' } }
        ];
    }

    // Dynamic Sort
    const sortObj: any = {};
    if (sortBy === 'price_asc') {
      sortObj.price = 1;
    } else if (sortBy === 'price_desc') {
      sortObj.price = -1;
    } else if (sortBy === 'rating') {
      sortObj.packageRating = -1;
    } else {
      sortObj.createdAt = -1;
    }

    const [packages, total] = await Promise.all([
      this.packageModel
        .find(searchQuery)
        .populate('categoryId', 'name')
        .populate('subcategoryId', 'name')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.packageModel.countDocuments(searchQuery).exec(),
    ]);

    return this.responseService.success('Packages retrieved successfully', {
      packages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(getPackageDto: GetPackageDto, req: any): Promise<ApiResponse> {
    const { packageId, slug } = getPackageDto;
    
    const query: any = {};
    if (packageId) {
      query._id = new Types.ObjectId(packageId);
    } else if (slug) {
      query.slug = slug;
    } else {
      return this.responseService.badRequest('Either packageId or slug is required');
    }

    const pkg = await this.packageModel
      .findOne(query)
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .exec();

    if (!pkg) {
      return this.responseService.notFound('Package not found');
    }

    return this.responseService.success('Package retrieved successfully', pkg);
  }

  async update(updatePackageDto: UpdatePackageDto, req: any): Promise<ApiResponse> {
    const { packageId, name, ...updateData } = updatePackageDto;
    const { userId } = req.user;
    
    const pkg = await this.packageModel.findById(packageId).exec();
    if (!pkg) {
      return this.responseService.notFound('Package not found');
    }

    const finalUpdate: any = { ...updateData };
    
    // Regenerate slug if name changes
    if (name && name !== pkg.name) {
        let slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        let slugExists = await this.packageModel.findOne({ slug, _id: { $ne: packageId } }).exec();
        let counter = 1;
        let originalSlug = slug;
        while (slugExists) {
            slug = `${originalSlug}-${counter}`;
            slugExists = await this.packageModel.findOne({ slug, _id: { $ne: packageId } }).exec();
            counter++;
        }
        finalUpdate.name = name;
        finalUpdate.slug = slug;
    }

    finalUpdate.updatedBy = new Types.ObjectId(userId);

    const updatedPackage = await this.packageModel.findByIdAndUpdate(
        packageId,
        { $set: finalUpdate },
        { new: true }
    ).exec();

    return this.responseService.success('Package updated successfully', updatedPackage);
  }

  async delete(deletePackageDto: DeletePackageDto, req: any): Promise<ApiResponse> {
    const { packageId } = deletePackageDto;
    await this.packageModel.findByIdAndDelete(packageId).exec();
    return this.responseService.success('Package deleted successfully', { packageId });
  }

  async getCounts(req: any): Promise<ApiResponse> {
    try {
      const subcategoryCounts = await this.packageModel.aggregate([
        { $match: { status: Status.ACTIVE } },
        { 
          $group: { 
            _id: '$subcategoryId', 
            count: { $sum: 1 } 
          } 
        },
        { 
          $lookup: {
            from: 'subcategories',
            localField: '_id',
            foreignField: '_id',
            as: 'subcategory'
          }
        },
        { $unwind: '$subcategory' },
        { 
          $project: {
            _id: 1,
            name: '$subcategory.name',
            count: 1
          }
        }
      ]);

      const typeCounts = await this.packageModel.aggregate([
        { $match: { status: Status.ACTIVE } },
        { 
          $group: { 
            _id: '$packageType', 
            count: { $sum: 1 } 
          } 
        },
        { 
          $project: {
            name: '$_id',
            count: 1
          }
        }
      ]);

      const total = await this.packageModel.countDocuments({ status: Status.ACTIVE });

      // Get unique cities from hotels array
      const cities = await this.packageModel.distinct('hotels.city', { status: Status.ACTIVE });
      
      // Get unique star ratings from hotels array
      const stars = await this.packageModel.distinct('hotels.starRating', { status: Status.ACTIVE });

      // Get unique durations
      const durations = await this.packageModel.distinct('durationNights', { status: Status.ACTIVE });

      return this.responseService.success('Counts retrieved successfully', {
        total,
        subcategories: subcategoryCounts,
        types: typeCounts.filter(t => t.name),
        cities: cities.filter(c => c),
        stars: stars.filter(s => s),
        durations: durations.sort((a, b) => a - b)
      });
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve counts', error.message);
    }
  }
}
