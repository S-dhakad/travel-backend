import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto, UpdateBannerDto, BannerListDto, DeleteBannerDto, GetActiveBannersDto } from './dto/banner.dto';
import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/type/response.type';
import { Status } from '../common/enums/status.enum';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private bannerModel: Model<BannerDocument>,
    private responseService: ResponseService,
  ) { }

  async getActiveBanners(getActiveBannersDto: GetActiveBannersDto, req: any): Promise<ApiResponse> {
    const { limit } = getActiveBannersDto;
    try {
      let query = this.bannerModel.find({ status: Status.ACTIVE }).select('-__v').sort({ createdAt: -1 });

      if (limit) {
        query = query.limit(limit);
      }

      const banners = await query.exec();
      return this.responseService.success('Active banners retrieved successfully', banners);
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve active banners', error.message);
    }
  }

  async create(createBannerDto: CreateBannerDto, req: any): Promise<ApiResponse> {
    const { name, image, status, description } = createBannerDto;
    const { userId } = req.user;

    // Check if banner with same name already exists
    const existingBanner = await this.bannerModel.findOne({ name }).exec();
    if (existingBanner) {
      return this.responseService.badRequest('Banner with this name already exists');
    }

    const banner = new this.bannerModel({
      name,
      image,
      description,
      status: status || Status.ACTIVE,
      createBy: new Types.ObjectId(userId),
    });

    await banner.save();

    return this.responseService.created('Banner created successfully', {
      bannerId: banner._id.toString(),
      name: banner.name,
      image: banner.image,
      description: banner.description,
      status: banner.status,
      createBy: banner.createBy?.toString(),
    });
  }

  async findAll(bannerListDto: BannerListDto, req: any): Promise<ApiResponse> {
    const { page = 1, limit = 10, search, status } = bannerListDto;
    const { user } = req;
    const skip = (page - 1) * limit;

    // Build search query - show all banners by default
    let searchQuery: any = {};
    if (status !== undefined) {
      searchQuery.status = status;
    }

    if (search && search.trim()) {
      searchQuery.$or = [
        { name: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const [banners, total] = await Promise.all([
      this.bannerModel
        .find(searchQuery)
        .populate('createBy', 'fullName email mobileNumber')
        .populate('updatedBy', 'fullName email mobileNumber')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bannerModel.countDocuments(searchQuery).exec(),
    ]);

    return this.responseService.success('Banners retrieved successfully', {
      banners,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
      search: search || undefined,
    });
  }

  async update(updateBannerDto: UpdateBannerDto, req: any): Promise<ApiResponse> {
    const { bannerId, ...updateData } = updateBannerDto;
    const { userId } = req.user;
    const banner = await this.bannerModel.findById(bannerId).exec();

    if (!banner) {
      return this.responseService.notFound('Banner not found');
    }

    // Check if name is being updated and if it's unique
    if (updateData.name && updateData.name !== banner.name) {
      const existingBanner = await this.bannerModel
        .findOne({ name: updateData.name })
        .exec();
      if (existingBanner) {
        return this.responseService.badRequest('Banner with this name already exists');
      }
    }

    // Update fields
    if (updateData.name !== undefined) banner.name = updateData.name;
    if (updateData.image !== undefined) banner.image = updateData.image;
    if (updateData.description !== undefined) banner.description = updateData.description;
    if (updateData.status !== undefined) banner.status = updateData.status;

    banner.updatedBy = new Types.ObjectId(userId);
    await banner.save();

    return this.responseService.success('Banner updated successfully', {
      bannerId: banner._id.toString(),
      name: banner.name,
      image: banner.image,
      description: banner.description,
      status: banner.status,
      updatedBy: banner.updatedBy?.toString(),
    });
  }

  async delete(deleteBannerDto: DeleteBannerDto, req: any): Promise<ApiResponse> {
    const { bannerId } = deleteBannerDto;
    const { userId } = req.user;
    const banner = await this.bannerModel.findById(bannerId).exec();

    if (!banner) {
      return this.responseService.notFound('Banner not found');
    }

    await this.bannerModel.findByIdAndDelete(bannerId).exec();

    return this.responseService.success('Banner deleted successfully', {
      bannerId: banner._id.toString(),
      name: banner.name,
    });
  }
}
