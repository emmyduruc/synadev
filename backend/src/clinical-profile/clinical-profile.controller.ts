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

import { ClinicalProfileService } from './clinical-profile.service';
import {
  ClinicalProfileDto,
  UpdateClinicalProfileDto,
} from './dto/clinical-profile.dto';

@ApiTags(SWAGGER_TAGS.clinicalProfile)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('clinical-profile')
export class ClinicalProfileController {
  constructor(private readonly clinicalProfileService: ClinicalProfileService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get clinical profile',
    description:
      'Returns the authenticated user clinical deepening / complete-profile document.',
  })
  @ApiOkResponse({ description: 'Clinical profile', type: ClinicalProfileDto })
  @ApiStandardResponses({ unauthorized: true })
  getProfile(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<ClinicalProfileDto> {
    return this.clinicalProfileService.getProfile(clerkUser);
  }

  @Put('me')
  @ApiOperation({
    summary: 'Save clinical profile',
    description: 'Fully replaces the authenticated user clinical profile.',
  })
  @ApiOkResponse({ description: 'Updated clinical profile', type: ClinicalProfileDto })
  @ApiStandardResponses({ unauthorized: true })
  replaceProfile(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: UpdateClinicalProfileDto,
  ): Promise<ClinicalProfileDto> {
    return this.clinicalProfileService.replaceProfile(clerkUser, dto);
  }
}
