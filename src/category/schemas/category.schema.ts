import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from '../../common/enums/status.enum';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop({ type: Boolean, default: false })
  landingPageEnabled: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ status: 1 });
