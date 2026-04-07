import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from '../../common/enums/status.enum';

export type SubcategoryDocument = Subcategory & Document;

@Schema({ timestamps: true })
export class Subcategory extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ 
    type: String, 
    enum: Status, 
    default: Status.ACTIVE 
  })
  status: Status;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);

// Add indexes
SubcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });
SubcategorySchema.index({ categoryId: 1 });
SubcategorySchema.index({ status: 1 });
