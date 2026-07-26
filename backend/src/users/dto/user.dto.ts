import {
  UpdateUserHealthMetricsSchema,
  UpdateUserLocaleSchema,
  UpdateUserProfileSchema,
  UserSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserProfileDto extends createZodDto(UpdateUserProfileSchema) {}

export class UpdateUserHealthMetricsDto extends createZodDto(
  UpdateUserHealthMetricsSchema,
) {}

export class UpdateUserLocaleDto extends createZodDto(UpdateUserLocaleSchema) {}

export class UserDto extends createZodDto(UserSchema) {}
