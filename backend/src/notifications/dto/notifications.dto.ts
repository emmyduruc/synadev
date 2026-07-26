import {
  RegisterPushTokenResponseSchema,
  RegisterPushTokenSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class RegisterPushTokenDto extends createZodDto(RegisterPushTokenSchema) {}

export class RegisterPushTokenResponseDto extends createZodDto(
  RegisterPushTokenResponseSchema,
) {}
