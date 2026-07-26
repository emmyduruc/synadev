import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
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
  UpdateUserHealthMetricsDto,
  UpdateUserLocaleDto,
  UpdateUserProfileDto,
  UserDto,
} from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags(SWAGGER_TAGS.users)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get or provision the current user',
    description:
      'Returns the authenticated Syna user. Creates a row on first call using the Clerk identity (clerk_id + email).',
  })
  @ApiOkResponse({
    description: 'Current user profile',
    type: UserDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  getMe(@CurrentClerkUser() clerkUser: AuthenticatedClerkUser): Promise<UserDto> {
    return this.usersService.ensureCurrentUser(clerkUser);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update the current user bio profile',
    description:
      'Persists first name, last name, date of birth, and optional address collected in onboarding.',
  })
  @ApiOkResponse({
    description: 'Updated user profile',
    type: UserDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  updateMe(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UserDto> {
    return this.usersService.updateCurrentUserProfile(clerkUser, dto);
  }

  @Patch('me/health-metrics')
  @ApiOperation({
    summary: 'Replace the current user health metrics snapshot',
    description:
      'Persists a typed JSONB snapshot of summarized wearable/health readings (steps, HR, sleep, etc.). Raw sample history is not stored.',
  })
  @ApiOkResponse({
    description: 'Updated user including healthMetrics',
    type: UserDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  updateHealthMetrics(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: UpdateUserHealthMetricsDto,
  ): Promise<UserDto> {
    return this.usersService.updateCurrentUserHealthMetrics(clerkUser, dto);
  }

  @Patch('me/locale')
  @ApiOperation({
    summary: 'Update preferred locale',
    description:
      'Stores the device/app language used for transactional emails and push notifications. Defaults to German (de) when unset.',
  })
  @ApiOkResponse({
    description: 'Updated user including locale',
    type: UserDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  updateLocale(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: UpdateUserLocaleDto,
  ): Promise<UserDto> {
    return this.usersService.updateCurrentUserLocale(clerkUser, dto.locale);
  }
}
