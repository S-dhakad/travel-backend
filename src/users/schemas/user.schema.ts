import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole, Gender } from '../enums/user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop({ required: false })
  profileImage?: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
    set: (v: string) => v?.toUpperCase(),
  })
  role: UserRole;

  @Prop({
    type: String,
    enum: Gender,
    set: (v: string) => v?.toUpperCase(),
  })
  gender?: Gender;

  @Prop({ type: Date })
  dob?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Date })
  lastLogin?: Date;

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: String },
      radius: { type: Number },
    },
    _id: false,
  })
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    radius?: number;
    pincode?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);


// Add geospatial index for location-based queries
UserSchema.index({ 'location.lat': 1, 'location.lng': 1 });

// Pre-validate hook to normalize role and gender to uppercase before validation
UserSchema.pre('validate', function () {
  if (this.role) {
    let roleStr = String(this.role).toUpperCase().trim();
    roleStr = roleStr.replace(/[^A-Z_]/g, '');
    this.role = roleStr as UserRole;
  }
  if (this.gender) {
    let genderStr = String(this.gender).toUpperCase().trim();
    genderStr = genderStr.replace(/[^A-Z]/g, '');
    this.gender = genderStr as Gender;
  }
});
