import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentClerkUser } from '../auth/current-clerk-user.decorator';
import { ApiStandardResponses } from '../common/decorators/api-standard-responses.decorator';
import { SWAGGER_TAGS } from '../swagger/swagger.constants';

import { ChatService } from './chat.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';

@ApiTags(SWAGGER_TAGS.chat)
@ApiBearerAuth('bearer')
@UseGuards(ClerkAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({
    summary: 'Ask SYNA about your health data',
    description:
      'Runs a GPT-backed chat turn with tool access to the authenticated user’s own period, mood, symptom, wearable, assessment, and profile rows only. '
      + 'Off-topic questions return status invalid_question. Empty tool results return status no_data. '
      + 'Replies follow the question language (or the request/profile locale).',
  })
  @ApiOkResponse({
    description: 'Assistant reply',
    type: ChatResponseDto,
  })
  @ApiStandardResponses({ unauthorized: true })
  chat(
    @CurrentClerkUser() clerkUser: AuthenticatedClerkUser,
    @Body() dto: ChatRequestDto,
  ) {
    return this.chatService.chat(clerkUser, dto);
  }
}
