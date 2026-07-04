import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiStandardResponses } from '../common/decorators/api-standard-responses.decorator';
import { SWAGGER_TAGS } from '../swagger/swagger.constants';

import { SendEmailDto, SendEmailResponseDto } from './dto/email.dto';
import { EmailService } from './email.service';

@ApiTags(SWAGGER_TAGS.emails)
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({
    summary: 'Send an email',
    description:
      'Sends a transactional email via Resend. Supports HTML and/or plain-text body, ' +
      'multiple recipients (to/cc/bcc), reply-to, and base64-encoded attachments. ' +
      'At least one of html or text is required. Attachments are limited to 10 files, ' +
      '10 MB each, 25 MB total.',
  })
  @ApiCreatedResponse({
    description: 'Email accepted and queued for delivery by Resend',
    type: SendEmailResponseDto,
  })
  @ApiStandardResponses()
  sendEmail(@Body() dto: SendEmailDto): Promise<SendEmailResponseDto> {
    return this.emailService.sendEmail(dto);
  }
}
