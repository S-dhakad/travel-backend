import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Legal } from './schemas/legal.schema';

@Injectable()
export class LegalService implements OnModuleInit {
    constructor(@InjectModel(Legal.name) private legalModel: Model<Legal>) {}

    async onModuleInit() {
        // Initialize with default record if none exists
        const count = await this.legalModel.countDocuments();
        if (count === 0) {
            await new this.legalModel({}).save();
        }
    }

    async getLegal() {
        return this.legalModel.findOne().lean();
    }

    async updateLegal(data: Partial<Legal>) {
        return this.legalModel.findOneAndUpdate({}, { $set: { ...data, updatedTime: new Date().toLocaleString() } }, { new: true, upsert: true });
    }
}
