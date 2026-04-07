import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog extends Document {
  @Prop({ type: String })
  page: string;

  @Prop({ type: String })
  pageName?: string;

  @Prop({ type: String })
  action: string; // 'view', 'click', 'dwell'

  @Prop({ type: String })
  buttonClicked?: string;

  @Prop({ type: String })
  packageSlug?: string;

  @Prop({ type: Number })
  dwellTime?: number; // in seconds

  @Prop({ type: String })
  categorySlug?: string;

  @Prop({ type: Number })
  scrollDepth?: number; // 25, 50, 75, 100 percentage

  @Prop({ type: Object })
  locationInfo: any;

  @Prop({ type: Object })
  systemInfo: any;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: Types.ObjectId;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
