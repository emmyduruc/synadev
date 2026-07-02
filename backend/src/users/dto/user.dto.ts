import {
  CreateUserSchema,
  HealthResponseSchema,
  UserSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class UserDto extends createZodDto(UserSchema) {}

export class HealthResponseDto extends createZodDto(HealthResponseSchema) {}
