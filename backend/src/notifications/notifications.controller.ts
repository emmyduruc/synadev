import { Body, Controller, Put, UseGuards } from '@nestjs/common';
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
  RegisterPushTokenDto,
  RegisterPushTokenResponseDto,
} from './dto/notifications.dto';
import { PushService } from './push.service';

@ApiTags(SWAGGER_TAGS.notifications)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly pushService: PushService) {}

  @Put('push-token')
  @ApiOperation({
    summary: 'Register Expo push token',
    description: 'Stores or updates the device Expo push token for the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Token registered',
    type: RegisterPushTokenResponseDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  registerPushToken(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: RegisterPushTokenDto,
  ): Promise<RegisterPushTokenResponseDto> {
    return this.pushService.registerToken(clerkUser, dto);
  }
}
