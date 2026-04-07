import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Status } from '../../common/enums/status.enum';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);

// Indexes for efficient querying
BannerSchema.index({ status: 1 });
BannerSchema.index({ createdAt: -1 });
BannerSchema.index({ createBy: 1 });
