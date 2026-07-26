import { Controller, Get, UseGuards } from '@nestjs/common';
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

import { CycleService } from './cycle.service';
import { CyclePhaseSnapshotResponseDto } from './dto/cycle.dto';

@ApiTags(SWAGGER_TAGS.cycle)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('cycle')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Get('phase')
  @ApiOperation({
    summary: 'Get current cycle phase estimate',
    description:
      'Computes period / follicular / ovulation / luteal from logged period days (calendar method). Persists state and may send email/push on phase transitions.',
  })
  @ApiOkResponse({
    description: 'Cycle phase snapshot',
    type: CyclePhaseSnapshotResponseDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  getPhase(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<CyclePhaseSnapshotResponseDto> {
    return this.cycleService.getPhaseForClerkUser(clerkUser);
  }
}
