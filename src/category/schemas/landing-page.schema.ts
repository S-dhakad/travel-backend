import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LandingPageDocument = LandingPage & Document;

@Schema({ timestamps: true })
export class LandingPage {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, unique: true })
  categoryId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: [String] })
  heroBanners: string[];

  @Prop({ type: String })
  description: string;

  @Prop({
    type: {
      phone: String,
      whatsapp: String,
      email: String,
    },
    _id: false,
  })
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };

  @Prop({
    type: {
      name: String,
      image: String,
      designation: String,
      bio: String,
    },
    _id: false,
  })
  agent: {
    name?: string;
    image?: string;
    designation?: string;
    bio?: string;
  };

  @Prop({
    type: {
      name: String,
      logo: String,
      license: String,
      experience: String,
      address: String,
      hours: String,
      mapUrl: String,
    },
    _id: false,
  })
  agency: {
    name?: string;
    logo?: string;
    license?: string;
    experience?: string;
    address?: string;
    hours?: string;
    mapUrl?: string;
  };

  @Prop({ type: [String] })
  destinations?: string[];

  @Prop({
    type: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String,
      youtube: String
    },
    _id: false,
  })
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };

  @Prop({
    type: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: String,
      ogTitle: String,
      ogDescription: String,
      ogImage: String,
      canonicalUrl: String,
    },
    _id: false,
  })
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };

  @Prop({ type: [{ q: String, a: String }], _id: false })
  faqs: { q: string; a: string }[];

  @Prop({ type: [{ name: String, text: String, role: String }], _id: false })
  testimonials: { name: string; text: string; role: string }[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const LandingPageSchema = SchemaFactory.createForClass(LandingPage);
