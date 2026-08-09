import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
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
  GetHealthDailyMetricsQueryDto,
  HealthDailyMetricsDto,
  UpsertHealthDailyMetricsDto,
} from './dto/health-daily.dto';
import { HealthDailyService } from './health-daily.service';

@ApiTags(SWAGGER_TAGS.healthMetrics)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('health')
export class HealthDailyController {
  constructor(private readonly healthDailyService: HealthDailyService) {}

  @Get('daily')
  @ApiOperation({
    summary: 'List daily health metrics',
    description:
      'Returns per-day aggregated wearable metrics for a date range (max 90 days). Used by Patterns.',
  })
  @ApiOkResponse({ description: 'Daily health series', type: HealthDailyMetricsDto })
  @ApiStandardResponses({ unauthorized: true })
  listDaily(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Query() query: GetHealthDailyMetricsQueryDto,
  ): Promise<HealthDailyMetricsDto> {
    return this.healthDailyService.listDaily(clerkUser, query);
  }

  @Put('daily')
  @ApiOperation({
    summary: 'Upsert daily health metrics',
    description:
      'Upserts day-bucketed wearable aggregates from the device lookback window. Does not delete other days.',
  })
  @ApiOkResponse({ description: 'Upserted daily rows', type: HealthDailyMetricsDto })
  @ApiStandardResponses({ unauthorized: true })
  upsertDaily(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: UpsertHealthDailyMetricsDto,
  ): Promise<HealthDailyMetricsDto> {
    return this.healthDailyService.upsertDaily(clerkUser, dto);
  }
}
