import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { ResponseService } from '../common/response/response.service';

@Controller('activity-log')
export class ActivityLogController {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly responseService: ResponseService
  ) {}

  @Post('record')
  async record(@Req() req: Request, @Body() body: any) {
    // Enrich with tracker middleware data
    const trackingData = {
      ...body,
      systemInfo: req['systemInfo'],
      locationInfo: req['locationInfo'],
      ip: req.ip || req.headers['x-forwarded-for'] || '0.0.0.0',
      user: (req.user as any)?.userId || null
    };

    const log = await this.activityLogService.record(trackingData);
    return this.responseService.success('Activity recorded', log);
  }

  @Post('stats')
  @UseGuards(AuthGuard)
  async getStats(@Body() body: any) {
    const stats = await this.activityLogService.getDashboardOverview(body.startDate, body.endDate);
    return this.responseService.success('Analytics overview gathered', stats);
  }

  @Post('map-analytics')
  @UseGuards(AuthGuard)
  async getMapAnalytics(@Body() body: any) {
    const data = await this.activityLogService.getMapAnalytics(body.startDate, body.endDate, body.action);
    return this.responseService.success('Map analytics gathered', data);
  }

  @Post('list')
  @UseGuards(AuthGuard)
  async findAll(@Body() body: any) {
    const data = await this.activityLogService.findAll(body);
    return this.responseService.success('Logs retrieved', data);
  }

  @Post('slug-stats/:slug')
  @UseGuards(AuthGuard)
  async getSlugStats(@Req() req: Request, @Body() body: any) {
    const data = await this.activityLogService.getSlugStats(req.params.slug, body.startDate, body.endDate);
    return this.responseService.success('Slug analytics gathered', data);
  }
}
