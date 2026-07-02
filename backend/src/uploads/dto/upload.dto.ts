import { UploadImageResponseSchema } from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class UploadImageResponseDto extends createZodDto(UploadImageResponseSchema) {}
