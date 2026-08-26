import { ChatRequestSchema, ChatResponseSchema } from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class ChatRequestDto extends createZodDto(ChatRequestSchema) {}
export class ChatResponseDto extends createZodDto(ChatResponseSchema) {}
