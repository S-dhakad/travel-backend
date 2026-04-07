import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { CreateSettingDto, GetSettingDto, UpdateSettingDto } from './dto/setting.dto';
import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/type/response.type';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    private responseService: ResponseService,
  ) { }

  async create(createSettingDto: CreateSettingDto, req: any): Promise<ApiResponse> {
    const { supportPhone, supportWhatsapp, supportEmail, siteName, logo } = createSettingDto;
    const { userId } = req.user;

    try {
      // Use upsert pattern (only one settings record should exist)
      let setting = await this.settingModel.findOne().exec();

      if (setting) {
        if (siteName !== undefined && siteName !== '') setting.siteName = siteName;
        if (logo !== undefined && logo !== '') setting.logo = logo;
        if (supportPhone !== undefined && supportPhone !== '') setting.supportPhone = supportPhone;
        if (supportWhatsapp !== undefined && supportWhatsapp !== '') setting.supportWhatsapp = supportWhatsapp;
        if (supportEmail !== undefined && supportEmail !== '') setting.supportEmail = supportEmail;
        
        setting.updatedBy = new Types.ObjectId(userId) as any;
        await setting.save();
        return this.responseService.success('Settings updated successfully', this.formatSetting(setting));
      }

      setting = new this.settingModel({
        siteName: siteName ?? 'TravelGig',
        logo: logo ?? '',
        supportPhone: supportPhone ?? '+91 9999999999',
        supportWhatsapp: supportWhatsapp ?? '+91 9999999999',
        supportEmail: supportEmail ?? 'support@travek.com',
        createdBy: new Types.ObjectId(userId) as any,
      });

      await setting.save();
      return this.responseService.created('Settings initialized successfully', this.formatSetting(setting));
    } catch (error: any) {
      return this.responseService.error('Failed to manage settings', error.message);
    }
  }

  async get(getSettingDto: GetSettingDto, req: any): Promise<ApiResponse> {
    try {
      const setting = await this.settingModel.findOne().exec();
      
      if (!setting) {
        // Return default settings if none exist yet
        return this.responseService.success('Settings retrieved successfully', {
          siteName: 'TravelGig',
          logo: '',
          supportPhone: '+91 9999999999',
          supportWhatsapp: '+91 9999999999',
          supportEmail: 'support@travek.com',
        });
      }

      return this.responseService.success('Settings retrieved successfully', this.formatSetting(setting));
    } catch (error: any) {
      return this.responseService.error('Failed to retrieve settings', error.message);
    }
  }

  private formatSetting(setting: SettingDocument) {
    return {
      settingId: setting._id.toString(),
      siteName: setting.siteName,
      logo: setting.logo,
      supportPhone: setting.supportPhone,
      supportWhatsapp: setting.supportWhatsapp,
      supportEmail: setting.supportEmail,
      updatedAt: setting['updatedAt'],
    };
  }
}
