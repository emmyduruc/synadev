import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { SendEmail, SendEmailResponse } from '@syna/shared-types';
import type { CreateEmailOptions } from 'resend';
import { Resend } from 'resend';

import {
  type EmailEnv,
  formatSenderAddress,
  parseEmailEnv,
} from './email.config';

type ResendAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private client: Resend | null = null;
  private env: EmailEnv | null = null;

  private getClient(): Resend {
    if (!this.client || !this.env) {
      this.env = parseEmailEnv();
      this.client = new Resend(this.env.RESEND_API_KEY);
      this.logger.log('Resend email client initialized');
    }

    return this.client;
  }

  async sendEmail(input: SendEmail): Promise<SendEmailResponse> {
    let env: EmailEnv;

    try {
      env = this.env ?? parseEmailEnv();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email is not configured';
      throw new ServiceUnavailableException(message);
    }

    const client = this.getClient();
    const fromAddress = input.from ?? formatSenderAddress(
      env.RESEND_FROM_EMAIL,
      env.RESEND_FROM_NAME,
    );

    const to = Array.isArray(input.to) ? input.to : [input.to];
    const replyTo = input.replyTo
      ? Array.isArray(input.replyTo)
        ? input.replyTo
        : [input.replyTo]
      : undefined;

    const attachments = input.attachments?.map(
      (attachment): ResendAttachment => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.content, 'base64'),
        contentType: attachment.contentType,
      }),
    );

    const baseOptions = {
      from: fromAddress,
      to,
      subject: input.subject,
      cc: input.cc,
      bcc: input.bcc,
      replyTo,
      attachments,
    };

    const payload: CreateEmailOptions = input.html
      ? {
          ...baseOptions,
          html: input.html,
          ...(input.text ? { text: input.text } : {}),
        }
      : {
          ...baseOptions,
          text: input.text as string,
        };

    const { data, error } = await client.emails.send(payload);

    if (error) {
      this.logger.error(`Resend send failed: ${error.message}`, error.name);

      if (error.name === 'validation_error') {
        throw new BadGatewayException(error.message);
      }

      if (error.name === 'application_error') {
        throw new ServiceUnavailableException(
          'Email provider is temporarily unavailable. Please try again later.',
        );
      }

      throw new BadGatewayException(error.message);
    }

    if (!data?.id) {
      throw new InternalServerErrorException('Email provider returned an unexpected response');
    }

    this.logger.log(`Email queued successfully: ${data.id}`);

    return {
      id: data.id,
      status: 'queued',
    };
  }
}
