
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from '../../common/enums/status.enum';

export type PackageDocument = Package & Document;

@Schema()
class ItineraryDetail {
  @Prop({ required: true })
  day: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

@Schema()
class HotelDetail {
  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  starRating: number;

  @Prop({ type: Number })
  nights: number;

  @Prop({ type: String })
  roomType: string;

  @Prop({ type: String })
  mealPlan: string;
}

@Schema({ timestamps: true })
export class Package extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subcategory' })
  subcategoryId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Number })
  discountedPrice: number;

  @Prop({ required: true, type: Number })
  durationDays: number;

  @Prop({ required: true, type: Number })
  durationNights: number;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  overview: string;

  @Prop({ type: String, enum: ['FIT', 'GROUP', 'CUSTOM'], default: 'FIT' })
  packageType: string;

  @Prop({ type: String })
  pickupPoint: string;

  @Prop({ type: String })
  dropoffPoint: string;

  @Prop({ type: Number })
  maxGuests: number;

  @Prop({ type: Number, min: 1, max: 5 })
  packageRating: number;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;

  @Prop({ type: String })
  departureCity: string;

  @Prop({ 
    type: String, 
    enum: ['FLIGHT', 'TRAIN', 'BUS', 'SELF_DRIVE', 'NOT_INCLUDED'],
    default: 'NOT_INCLUDED'
  })
  transportMode: string;

  @Prop({ type: String })
  transportDetails: string;

  @Prop({ type: Boolean, default: false })
  visaIncluded: boolean;

  @Prop({ type: Number })
  minAge: number;

  @Prop({ type: Number })
  maxAge: number;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [HotelDetail] })
  hotels: HotelDetail[];

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: [ItineraryDetail] })
  itinerary: ItineraryDetail[];

  @Prop({ type: [String] })
  inclusions: string[];

  @Prop({ type: [String] })
  exclusions: string[];

  @Prop({ type: [String] })
  highlights: string[];

  @Prop({ type: String })
  cancellationPolicy: string;

  @Prop({ type: String })
  usefulInfo: string;

  @Prop({ type: String })
  termsCondition: string;

  @Prop({ 
    type: String, 
    enum: Status, 
    default: Status.ACTIVE 
  })
  status: Status;

  @Prop({ type: Boolean, default: false })
  isBestSelling: boolean;

  @Prop({ type: Boolean, default: false })
  isPopular: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const PackageSchema = SchemaFactory.createForClass(Package);

// Indexes for better search
PackageSchema.index({ name: 'text', description: 'text', location: 'text' });
PackageSchema.index({ slug: 1 });
PackageSchema.index({ status: 1 });
PackageSchema.index({ categoryId: 1 });
PackageSchema.index({ subcategoryId: 1 });
PackageSchema.index({ price: 1 });
