import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
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

import {
  CreateCustomSymptomDto,
  CustomSymptomDto,
  CustomSymptomsDto,
  ReplaceSymptomFavoritesDto,
  ReplaceSymptomLogsDto,
  SymptomCatalogDto,
  SymptomFavoritesDto,
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
    description:
      'Returns seeded symptom categories plus the authenticated user custom symptoms.',
  })
  @ApiOkResponse({ description: 'Symptom catalog', type: SymptomCatalogDto })
  @ApiStandardResponses({ unauthorized: true })
  getCatalog(@CurrentClerkUser() clerkUser: AuthenticatedClerkUser): Promise<SymptomCatalogDto> {
    return this.symptomsService.getCatalog(clerkUser);
  }

  @Get('custom')
  @ApiOperation({
    summary: 'List custom symptoms',
    description: 'Returns user-defined own symptoms for the authenticated user.',
  })
  @ApiOkResponse({ description: 'Custom symptoms', type: CustomSymptomsDto })
  @ApiStandardResponses({ unauthorized: true })
  listCustom(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<CustomSymptomsDto> {
    return this.symptomsService.listCustomSymptoms(clerkUser);
  }

  @Post('custom')
  @ApiOperation({
    summary: 'Create custom symptom',
    description: 'Creates a user-defined symptom with designation and optional category.',
  })
  @ApiCreatedResponse({ description: 'Created custom symptom', type: CustomSymptomDto })
  @ApiStandardResponses({ unauthorized: true })
  createCustom(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: CreateCustomSymptomDto,
  ): Promise<CustomSymptomDto> {
    return this.symptomsService.createCustomSymptom(clerkUser, dto);
  }

  @Get('favorites')
  @ApiOperation({
    summary: 'List favorite symptoms',
    description: 'Returns the authenticated user favorite symptom ids for quick access.',
  })
  @ApiOkResponse({ description: 'Favorite symptoms', type: SymptomFavoritesDto })
  @ApiStandardResponses({ unauthorized: true })
  listFavorites(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<SymptomFavoritesDto> {
    return this.symptomsService.listFavorites(clerkUser);
  }

  @Put('favorites')
  @ApiOperation({
    summary: 'Replace favorite symptoms',
    description: 'Replaces the authenticated user favorite symptom id list.',
  })
  @ApiOkResponse({ description: 'Updated favorite symptoms', type: SymptomFavoritesDto })
  @ApiStandardResponses({ unauthorized: true })
  replaceFavorites(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: ReplaceSymptomFavoritesDto,
  ): Promise<SymptomFavoritesDto> {
    return this.symptomsService.replaceFavorites(clerkUser, dto);
  }

  @Get('logs')
  @ApiOperation({
    summary: 'List symptom logs',
    description: 'Returns selected symptom entries keyed by YYYY-MM-DD for the authenticated user.',
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
