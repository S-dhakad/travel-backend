import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Legal extends Document {
    @Prop({ required: true, default: '<h1>Privacy Policy</h1><p>Please update this content from the Admin Panel.</p>' })
    privacyPolicy: string;

    @Prop({ required: true, default: '<h1>Terms and Conditions</h1><p>Please update this content from the Admin Panel.</p>' })
    termsAndConditions: string;

    @Prop({ required: true, default: '<h1>About PolicyBoss</h1><p>PolicyBoss is your trusted partner for vehicle insurance management.</p>' })
    aboutUs: string;
}

export const LegalSchema = SchemaFactory.createForClass(Legal);
