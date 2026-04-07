import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuoteDocument = Quote & Document;

@Schema({ timestamps: true })
export class Quote extends Document {
  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  departureCity: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Object, required: false })
  systemInfo: Record<string, any>;

  @Prop({ type: Object, required: false })
  locationInfo: Record<string, any>;

  @Prop({ required: false })
  sourceLandingPage: string;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);

QuoteSchema.index({ createdAt: -1 });
