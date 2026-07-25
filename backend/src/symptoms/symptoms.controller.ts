import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentClerkUser } from '../auth/current-clerk-user.decorator';
import { ApiStandardResponses } from '../common/decorators/api-standard-responses.decorator';
import { SWAGGER_TAGS } from '../swagger/swagger.constants';

import {
  ReplaceSymptomLogsDto,
  SymptomCatalogDto,
  SymptomLogsDto,
} from './dto/symptoms.dto';
import { SymptomsService } from './symptoms.service';

@ApiTags(SWAGGER_TAGS.symptoms)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Get('catalog')
  @ApiOperation({
    summary: 'Get symptom catalog',
    description: 'Returns seeded symptom categories and child symptom ids (1NF reference data).',
  })
  @ApiOkResponse({ description: 'Symptom catalog', type: SymptomCatalogDto })
  @ApiStandardResponses({ unauthorized: true })
  getCatalog(): Promise<SymptomCatalogDto> {
    return this.symptomsService.getCatalog();
  }

  @Get('logs')
  @ApiOperation({
    summary: 'List symptom logs',
    description: 'Returns selected symptom ids keyed by YYYY-MM-DD for the authenticated user.',
  })
  @ApiOkResponse({ description: 'Symptom logs', type: SymptomLogsDto })
  @ApiStandardResponses({ unauthorized: true })
  listLogs(@CurrentClerkUser() clerkUser: AuthenticatedClerkUser): Promise<SymptomLogsDto> {
    return this.symptomsService.listLogs(clerkUser);
  }

  @Put('logs')
  @ApiOperation({
    summary: 'Replace symptom logs',
    description:
      'Replaces the full symptom log map. Each (user, date, symptom) triple is one row in symptom_entries.',
  })
  @ApiOkResponse({ description: 'Updated symptom logs', type: SymptomLogsDto })
  @ApiStandardResponses({ unauthorized: true })
  replaceLogs(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: ReplaceSymptomLogsDto,
  ): Promise<SymptomLogsDto> {
    return this.symptomsService.replaceLogs(clerkUser, dto);
  }
}
