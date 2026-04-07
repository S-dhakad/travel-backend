import { Controller, Post, Body } from '@nestjs/common';
import { LegalService } from './legal.service';
import { ResponseService } from '../common/response/response.service';
import { GetLegalDto, UpdateLegalDto, LegalContentType } from './dto/legal.dto';

@Controller('legaldata')
export class LegalController {
    constructor(
        private legalService: LegalService,
        private responseService: ResponseService
    ) {}

    @Post('get-legal')
    async getLegal(@Body() getLegalDto: GetLegalDto) {
        const data = await this.legalService.getLegal();
        
        if (!data) {
            return this.responseService.error("Legal content not initialized");
        }

        const type = getLegalDto.type;

        if (!type || type === LegalContentType.ALL) {
            return this.responseService.success("Full legal dossier synced", data);
        }

        // Project Flow: Specific data filtering based on DTO parameter
        const contents: Record<string, string> = {
            [LegalContentType.PRIVACY]: data.privacyPolicy,
            [LegalContentType.TERMS]: data.termsAndConditions,
            [LegalContentType.ABOUT]: data.aboutUs
        };

        const requestedContent = contents[type];

        if (requestedContent !== undefined) {
            return this.responseService.success(`${type} fetched successfully`, requestedContent);
        }

        return this.responseService.error("Invalid content type requested via protocol.");
    }

    @Post('update-legal')
    async updateLegal(@Body() updateLegalDto: UpdateLegalDto) {
        if (!updateLegalDto || Object.keys(updateLegalDto).length === 0) {
            return this.responseService.error("Internal Validation Error: Empty payload received.");
        }
        
        const result = await this.legalService.updateLegal(updateLegalDto);
        return this.responseService.success("Legal data protocol synchronized", result);
    }
}
