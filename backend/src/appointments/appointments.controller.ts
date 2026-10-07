import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
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

import { AppointmentsService } from './appointments.service';
import {
  UpdateUserAppointmentDto,
  UserAppointmentDto,
} from './dto/appointment.dto';

@ApiTags(SWAGGER_TAGS.appointments)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get upcoming doctor appointment',
    description: 'Returns the authenticated user appointment, or empty fields if unset.',
  })
  @ApiOkResponse({ description: 'User appointment', type: UserAppointmentDto })
  @ApiStandardResponses({ unauthorized: true })
  getAppointment(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<UserAppointmentDto> {
    return this.appointmentsService.getAppointment(clerkUser);
  }

  @Put('me')
  @ApiOperation({
    summary: 'Save doctor appointment',
    description: 'Fully replaces the authenticated user appointment.',
  })
  @ApiOkResponse({ description: 'Updated appointment', type: UserAppointmentDto })
  @ApiStandardResponses({ unauthorized: true })
  replaceAppointment(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: UpdateUserAppointmentDto,
  ): Promise<UserAppointmentDto> {
    return this.appointmentsService.replaceAppointment(clerkUser, dto);
  }

  @Delete('me')
  @ApiOperation({
    summary: 'Cancel doctor appointment',
    description: 'Clears the authenticated user appointment fields.',
  })
  @ApiOkResponse({ description: 'Cleared appointment', type: UserAppointmentDto })
  @ApiStandardResponses({ unauthorized: true })
  clearAppointment(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
  ): Promise<UserAppointmentDto> {
    return this.appointmentsService.clearAppointment(clerkUser);
  }
}
