import { SendEmailResponseSchema, SendEmailSchema } from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class SendEmailDto extends createZodDto(SendEmailSchema) {}

export class SendEmailResponseDto extends createZodDto(SendEmailResponseSchema) {}
