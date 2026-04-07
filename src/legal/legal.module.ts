import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LegalController } from './legal.controller';
import { LegalService } from './legal.service';
import { Legal, LegalSchema } from './schemas/legal.schema';
import { ResponseModule } from '../common/response/response.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Legal.name, schema: LegalSchema }]),
        ResponseModule
    ],
    controllers: [LegalController],
    providers: [LegalService],
    exports: [LegalService]
})
export class LegalModule {}
