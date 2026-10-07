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
  ReportPreferencesDto,
  UpdateReportPreferencesDto,
} from './dto/report.dto';
import { ReportService } from './report.service';

@ApiTags(SWAGGER_TAGS.report)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('preferences')
  @ApiOperation({
    summary: 'Get report preferences',
    description:
      'Returns persisted report-tab selections: period range, doctor questions, and concerns.',
  })
  @ApiOkResponse({ description: 'Report preferences', type: ReportPreferencesDto })
  @ApiStandardResponses({ unauthorized: true })
  getPreferences(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<ReportPreferencesDto> {
    return this.reportService.getPreferences(clerkUser);
  }

  @Put('preferences')
  @ApiOperation({
    summary: 'Replace report preferences',
    description:
      'Fully replaces report-tab preferences and related selection rows for the user.',
  })
  @ApiOkResponse({ description: 'Updated report preferences', type: ReportPreferencesDto })
  @ApiStandardResponses({ unauthorized: true })
  replacePreferences(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: UpdateReportPreferencesDto,
  ): Promise<ReportPreferencesDto> {
    return this.reportService.replacePreferences(clerkUser, dto);
  }
}
