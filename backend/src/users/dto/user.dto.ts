import {
  UpdateUserProfileSchema,
  UserSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserProfileDto extends createZodDto(UpdateUserProfileSchema) {}

export class UserDto extends createZodDto(UserSchema) {}
