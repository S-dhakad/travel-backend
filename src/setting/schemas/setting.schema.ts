import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting extends Document {
  @Prop({ type: String, default: 'TravelGig' })
  siteName: string;

  @Prop({ type: String, default: '' })
  logo: string;

  // Support and Contact Details
  @Prop({ type: String, default: '+91 9999999999' })
  supportPhone: string;

  @Prop({ type: String, default: '+91 9999999999' })
  supportWhatsapp: string;

  @Prop({ type: String, default: 'support@travek.com' })
  supportEmail: string;

  // Policies and Legal Content (HTMl/Rich Text)
  @Prop({ type: String, default: 'Privacy Policy content goes here...' })
  privacyPolicy: string;

  @Prop({ type: String, default: 'Terms and Conditions content goes here...' })
  termsAndConditions: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
