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

import { PeriodDaysDto, ReplacePeriodDaysDto } from './dto/period.dto';
import { PeriodService } from './period.service';

@ApiTags(SWAGGER_TAGS.period)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Get('days')
  @ApiOperation({
    summary: 'List period days',
    description: 'Returns all logged bleeding days for the authenticated user.',
  })
  @ApiOkResponse({ description: 'Period days', type: PeriodDaysDto })
  @ApiStandardResponses({ unauthorized: true })
  listDays(@CurrentClerkUser() clerkUser: AuthenticatedClerkUser): Promise<PeriodDaysDto> {
    return this.periodService.listDays(clerkUser);
  }

  @Put('days')
  @ApiOperation({
    summary: 'Replace period days',
    description:
      'Replaces the full set of period days for the user (used by calendar edit and record-period).',
  })
  @ApiOkResponse({ description: 'Updated period days', type: PeriodDaysDto })
  @ApiStandardResponses({ unauthorized: true })
  replaceDays(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: ReplacePeriodDaysDto,
  ): Promise<PeriodDaysDto> {
    return this.periodService.replaceDays(clerkUser, dto);
  }
}
