import {
  UpdateUserAppointmentSchema,
  UserAppointmentSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class UserAppointmentDto extends createZodDto(UserAppointmentSchema) {}

export class UpdateUserAppointmentDto extends createZodDto(
  UpdateUserAppointmentSchema,
) {}
