import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentClerkUser } from '../auth/current-clerk-user.decorator';
import { ApiStandardResponses } from '../common/decorators/api-standard-responses.decorator';
import { SWAGGER_TAGS } from '../swagger/swagger.constants';

import { AssessmentsService } from './assessments.service';
import {
  MrsIiAssessmentSubmissionDto,
  MrsIiLatestDto,
  Pam13AssessmentSubmissionDto,
  Pam13LatestDto,
  Phq2AssessmentSubmissionDto,
  Phq2LatestDto,
  SubmitMrsIiAssessmentDto,
  SubmitPam13AssessmentDto,
  SubmitPhq2AssessmentDto,
} from './dto/assessments.dto';

@ApiTags(SWAGGER_TAGS.assessments)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post('mrs-ii')
  @ApiOperation({
    summary: 'Submit MRS-II assessment',
    description:
      'Persists an MRS-II questionnaire in 1NF (submission + per-item answers). '
      + 'Server recomputes total and subscale scores from the 11 answers (0-4 each).',
  })
  @ApiCreatedResponse({
    description: 'MRS-II submission saved',
    type: MrsIiAssessmentSubmissionDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  submitMrsIi(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: SubmitMrsIiAssessmentDto,
  ): Promise<MrsIiAssessmentSubmissionDto> {
    return this.assessmentsService.submitMrsIi(clerkUser, dto);
  }

  @Get('mrs-ii/latest')
  @ApiOperation({
    summary: 'Get latest MRS-II assessment',
    description:
      'Returns the most recent MRS-II submission for the authenticated user, or null if none.',
  })
  @ApiOkResponse({ description: 'Latest MRS-II submission', type: MrsIiLatestDto })
  @ApiStandardResponses({ unauthorized: true })
  getLatestMrsIi(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<MrsIiLatestDto> {
    return this.assessmentsService.getLatestMrsIi(clerkUser);
  }

  @Post('pam-13')
  @ApiOperation({
    summary: 'Submit PAM-13 assessment',
    description:
      'Persists a Patient Activation Measure (13-item) questionnaire in 1NF. '
      + 'Server recomputes the raw total (13-52). Official 0-100 scaling can be added later.',
  })
  @ApiCreatedResponse({
    description: 'PAM-13 submission saved',
    type: Pam13AssessmentSubmissionDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  submitPam13(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: SubmitPam13AssessmentDto,
  ): Promise<Pam13AssessmentSubmissionDto> {
    return this.assessmentsService.submitPam13(clerkUser, dto);
  }

  @Get('pam-13/latest')
  @ApiOperation({
    summary: 'Get latest PAM-13 assessment',
    description:
      'Returns the most recent PAM-13 submission for the authenticated user, or null if none.',
  })
  @ApiOkResponse({ description: 'Latest PAM-13 submission', type: Pam13LatestDto })
  @ApiStandardResponses({ unauthorized: true })
  getLatestPam13(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<Pam13LatestDto> {
    return this.assessmentsService.getLatestPam13(clerkUser);
  }

  @Post('phq-2')
  @ApiOperation({
    summary: 'Submit PHQ-2 assessment',
    description:
      'Persists a PHQ-2 (2-item depression screen) questionnaire in 1NF. '
      + 'Server recomputes the total score (0-6) from answers (0-3 each).',
  })
  @ApiCreatedResponse({
    description: 'PHQ-2 submission saved',
    type: Phq2AssessmentSubmissionDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  submitPhq2(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: SubmitPhq2AssessmentDto,
  ): Promise<Phq2AssessmentSubmissionDto> {
    return this.assessmentsService.submitPhq2(clerkUser, dto);
  }

  @Get('phq-2/latest')
  @ApiOperation({
    summary: 'Get latest PHQ-2 assessment',
    description:
      'Returns the most recent PHQ-2 submission for the authenticated user, or null if none.',
  })
  @ApiOkResponse({ description: 'Latest PHQ-2 submission', type: Phq2LatestDto })
  @ApiStandardResponses({ unauthorized: true })
  getLatestPhq2(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<Phq2LatestDto> {
    return this.assessmentsService.getLatestPhq2(clerkUser);
  }
}
