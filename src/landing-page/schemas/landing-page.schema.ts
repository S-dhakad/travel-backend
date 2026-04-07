import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LandingPageDocument = LandingPage & Document;

@Schema({ _id: false })
class SocialLinks {
  @Prop({ type: String }) facebook: string;
  @Prop({ type: String }) instagram: string;
  @Prop({ type: String }) linkedin: string;
  @Prop({ type: String }) twitter: string;
  @Prop({ type: String }) youtube: string;
}

@Schema({ _id: false })
class Seo {
  @Prop({ type: String }) metaTitle: string;
  @Prop({ type: String }) metaDescription: string;
  @Prop({ type: String }) metaKeywords: string;
  @Prop({ type: String }) ogTitle: string;
  @Prop({ type: String }) ogDescription: string;
  @Prop({ type: String }) ogImage: string;
  @Prop({ type: String }) canonicalUrl: string;
}

@Schema({ _id: false })
class FAQ {
  @Prop({ type: String }) q: string;
  @Prop({ type: String }) a: string;
}

@Schema({ _id: false })
class Testimonial {
  @Prop({ type: String }) name: string;
  @Prop({ type: String }) text: string;
  @Prop({ type: String }) role: string;
}

@Schema({ _id: false })
class Highlight {
  @Prop({ type: String }) icon: string;
  @Prop({ type: String }) label: string;
  @Prop({ type: String }) value: string;
}

@Schema({ _id: false })
class Point {
  @Prop({ type: String }) icon: string;
  @Prop({ type: String }) title: string;
  @Prop({ type: String }) description: string;
}

@Schema({ timestamps: true })
export class LandingPage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, unique: true })
  categoryId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  videoUrl: string;

  @Prop({ type: [Highlight] })
  highlights: Highlight[];

  @Prop({ type: [Point] })
  whyChooseUs: Point[];

  // Contact Info Object
  @Prop({
    type: {
      phone: String,
      whatsapp: String,
      email: String,
    },
    _id: false
  })
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };

  // Agent/Specialist Info Object
  @Prop({
    type: {
      name: String,
      image: String,
      designation: String,
      bio: String,
    },
    _id: false
  })
  agent: {
    name?: string;
    image?: string;
    designation?: string;
    bio?: string;
  };

  // Agency/Business Info Object
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
    _id: false
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
  destinations: string[];

  @Prop({ type: SocialLinks })
  socialLinks: SocialLinks;

  @Prop({ type: Seo })
  seo: Seo;

  @Prop({ type: [FAQ] })
  faqs: FAQ[];

  @Prop({ type: [Testimonial] })
  testimonials: Testimonial[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const LandingPageSchema = SchemaFactory.createForClass(LandingPage);
