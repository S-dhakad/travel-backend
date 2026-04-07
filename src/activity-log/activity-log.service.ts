import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Package, PackageDocument } from '../package/schemas/package.schema';
import { Quote, QuoteDocument } from '../quote/schemas/quote.schema';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
    @InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
  ) {}

  async record(data: any): Promise<ActivityLog> {
    const log = new this.activityLogModel(data);
    return await log.save();
  }

  async findAll(query: any = {}): Promise<any> {
    const { page = 1, limit = 20, search, startDate, endDate } = query;
    const skip = (page - 1) * limit;
    
    let filter: any = {};
    if (search) {
      filter.$or = [
        { page: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { buttonClicked: { $regex: search, $options: 'i' } },
        { ip: { $regex: search, $options: 'i' } },
        { pageName: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      this.activityLogModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'fullName email').exec(),
      this.activityLogModel.countDocuments(filter).exec()
    ]);

    return { 
      logs, 
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getTopPackages(): Promise<any[]> {
    return await this.activityLogModel.aggregate([
      { $match: { packageSlug: { $exists: true, $ne: null } } },
      { $group: { _id: '$packageSlug', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).exec();
  }

  async getTopLocations(): Promise<any[]> {
    return await this.activityLogModel.aggregate([
      { $match: { 'locationInfo.city': { $exists: true, $ne: null } } },
      { $group: { _id: '$locationInfo.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).exec();
  }

  async getMapAnalytics(startDate?: string, endDate?: string, action?: string): Promise<any[]> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (action) filter.action = action;

    return await this.activityLogModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$locationInfo.city',
          hitCount: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$ip' }, 
          lastAction: { $last: '$action' },
          lat: { $first: '$locationInfo.latitude' },
          lng: { $first: '$locationInfo.longitude' },
          state: { $first: '$locationInfo.region_name' }
        }
      },
      { $match: { _id: { $ne: null }, lat: { $ne: null } } },
      { $project: { 
        city: '$_id', 
        hitCount: 1, 
        uniqueVisitors: { $size: '$uniqueVisitors' }, 
        lastAction: 1, 
        lat: 1, 
        lng: 1,
        state: 1
      } },
      { $sort: { uniqueVisitors: -1 } }
    ]).exec();
  }

  async getDashboardOverview(startDate?: string, endDate?: string): Promise<any> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [totalUsers, totalPackages, totalQuotes, recentQuotes, topPackages, topLocations, totalViews, timeStats, topCategories, detailedLandingStats, recentLogs, deviceStats, topClicks] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.packageModel.countDocuments().exec(),
      this.quoteModel.countDocuments(filter).exec(),
      this.quoteModel.find().sort({ createdAt: -1 }).limit(5).exec(),
      this.activityLogModel.aggregate([
        { $match: { ...filter, packageSlug: { $exists: true, $ne: null } } },
        { $group: { _id: '$packageSlug', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),
      this.activityLogModel.aggregate([
        { $match: { ...filter, 'locationInfo.city': { $exists: true, $ne: null } } },
        { $group: { _id: '$locationInfo.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),
      this.activityLogModel.countDocuments({ ...filter, action: { $in: ['view', 'package_view', 'category_view'] } }).exec(),
      this.activityLogModel.aggregate([
        { $match: { ...filter, dwellTime: { $exists: true, $ne: null } } },
        { $group: { _id: null, totalSeconds: { $sum: '$dwellTime' } } }
      ]).exec(),
      this.activityLogModel.aggregate([
        { $match: { ...filter, categorySlug: { $exists: true, $ne: null } } },
        { $group: { _id: '$categorySlug', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),
      this.activityLogModel.aggregate([
        { $match: { ...filter, categorySlug: { $exists: true, $ne: null } } },
        {
          $group: {
            _id: '$categorySlug',
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$ip' },
            avgDwell: { $avg: '$dwellTime' }
          }
        },
        {
          $project: {
            categorySlug: '$_id',
            views: 1,
            uniqueVisitors: { $size: '$uniqueVisitors' },
            avgDwell: { $round: ['$avgDwell', 1] }
          }
        },
        { $sort: { views: -1 } }
      ]).exec(),
      this.activityLogModel.find(filter).sort({ createdAt: -1 }).limit(10).populate('user', 'fullName').exec(),
      this.activityLogModel.aggregate([
          { $match: filter },
          { $group: { _id: { $arrayElemAt: ['$systemInfo.browserBrands.brand', 0] }, count: { $sum: 1 } } },
          { $match: { _id: { $ne: null } } },
          { $sort: { count: -1 } }
      ]).exec(),
      this.activityLogModel.aggregate([
          { $match: { ...filter, action: 'click' } },
          { $group: { _id: '$buttonClicked', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
      ]).exec()
    ]);

    const totalTimeSpent = timeStats[0]?.totalSeconds || 0;

    return {
      totalUsers,
      totalPackages,
      totalQuotes,
      recentQuotes,
      topPackages,
      topLocations,
      topCategories,
      detailedLandingStats,
      recentLogs,
      deviceStats,
      topClicks,
      totalViews,
      totalTimeSpent
    };
  }

  async getSlugStats(slug: string, startDate?: string, endDate?: string): Promise<any> {
    const filter: any = { categorySlug: slug };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [views, uniqueVisitors, dwellStats, clickStats, topLocations, recentLogs] = await Promise.all([
      this.activityLogModel.countDocuments(filter).exec(),
      this.activityLogModel.distinct('ip', filter).exec(),
      this.activityLogModel.aggregate([
        { $match: { ...filter, dwellTime: { $exists: true, $ne: null } } },
        { $group: { _id: null, avgDwell: { $avg: '$dwellTime' }, totalDwell: { $sum: '$dwellTime' } } }
      ]).exec(),
      this.activityLogModel.aggregate([
        { $match: { ...filter, action: 'click' } },
        { $group: { _id: '$buttonClicked', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),
      this.activityLogModel.aggregate([
        { $match: { ...filter, 'locationInfo.city': { $exists: true, $ne: null } } },
        { $group: { _id: '$locationInfo.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),
      this.activityLogModel.find(filter).sort({ createdAt: -1 }).limit(10).populate('user', 'fullName').exec()
    ]);

    const quotes = await this.quoteModel.countDocuments({ 
        sourceLandingPage: { $regex: slug, $options: 'i' } 
    }).exec();

    return {
      views,
      uniqueVisitors: uniqueVisitors.length,
      avgDwell: dwellStats[0]?.avgDwell || 0,
      totalDwell: dwellStats[0]?.totalDwell || 0,
      clicks: clickStats,
      topLocations,
      recentLogs,
      quotes
    };
  }
}
