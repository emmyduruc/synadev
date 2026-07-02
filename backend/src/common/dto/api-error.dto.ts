import { ApiErrorSchema } from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class ApiErrorDto extends createZodDto(ApiErrorSchema) {}
