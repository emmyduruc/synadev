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

import { MoodLogsDto, ReplaceMoodLogsDto } from './dto/mood.dto';
import { MoodService } from './mood.service';

@ApiTags(SWAGGER_TAGS.mood)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('mood')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @Get('logs')
  @ApiOperation({
    summary: 'List mood logs',
    description: 'Returns all mood check-ins keyed by YYYY-MM-DD for the authenticated user.',
  })
  @ApiOkResponse({ description: 'Mood logs', type: MoodLogsDto })
  @ApiStandardResponses({ unauthorized: true })
  listLogs(@CurrentClerkUser() clerkUser: AuthenticatedClerkUser): Promise<MoodLogsDto> {
    return this.moodService.listLogs(clerkUser);
  }

  @Put('logs')
  @ApiOperation({
    summary: 'Replace mood logs',
    description:
      'Replaces the full mood log map. Empty entries are dropped. Secondary feelings are stored in mood_entry_feelings.',
  })
  @ApiOkResponse({ description: 'Updated mood logs', type: MoodLogsDto })
  @ApiStandardResponses({ unauthorized: true })
  replaceLogs(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: ReplaceMoodLogsDto,
  ): Promise<MoodLogsDto> {
    return this.moodService.replaceLogs(clerkUser, dto);
  }
}
