import { HealthResponseSchema } from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class HealthResponseDto extends createZodDto(HealthResponseSchema) {}
