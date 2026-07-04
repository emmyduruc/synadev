import { z } from 'zod';

export const MAX_EMAIL_RECIPIENTS = 50;
export const MAX_EMAIL_ATTACHMENTS = 10;
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const MAX_TOTAL_ATTACHMENT_BYTES = 25 * 1024 * 1024;

export const EmailAttachmentSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename is too long')
    .describe('Attachment filename including extension (e.g. report.pdf)'),
  content: z
    .string()
    .min(1, 'Attachment content is required')
    .describe('Base64-encoded file content'),
  contentType: z
    .string()
    .optional()
    .describe('MIME type of the attachment (e.g. application/pdf, image/png)'),
});

export type EmailAttachment = z.infer<typeof EmailAttachmentSchema>;

const recipientSchema = z
  .string()
  .email('Invalid email address')
  .describe('Valid email address');

const recipientsSchema = z
  .union([recipientSchema, z.array(recipientSchema).min(1).max(MAX_EMAIL_RECIPIENTS)])
  .describe('Single recipient email or array of recipient emails');

export const SendEmailSchema = z
  .object({
    to: recipientsSchema.describe('Primary recipient(s)'),
    subject: z
      .string()
      .min(1, 'Subject is required')
      .max(998, 'Subject is too long')
      .describe('Email subject line'),
    html: z.string().optional().describe('HTML email body'),
    text: z.string().optional().describe('Plain-text email body'),
    cc: z
      .array(recipientSchema)
      .max(MAX_EMAIL_RECIPIENTS)
      .optional()
      .describe('Carbon copy recipients'),
    bcc: z
      .array(recipientSchema)
      .max(MAX_EMAIL_RECIPIENTS)
      .optional()
      .describe('Blind carbon copy recipients'),
    replyTo: z
      .union([recipientSchema, z.array(recipientSchema).max(MAX_EMAIL_RECIPIENTS)])
      .optional()
      .describe('Reply-to address(es)'),
    from: z
      .string()
      .email('Invalid sender email')
      .optional()
      .describe('Override default sender — must be a verified domain in Resend'),
    attachments: z
      .array(EmailAttachmentSchema)
      .max(MAX_EMAIL_ATTACHMENTS)
      .optional()
      .describe('File attachments encoded as base64'),
  })
  .superRefine((value, context) => {
    if (!value.html && !value.text) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either html or text body is required',
        path: ['html'],
      });
    }

    if (!value.attachments?.length) {
      return;
    }

    let totalBytes = 0;

    for (const [index, attachment] of value.attachments.entries()) {
      let decodedBytes: Buffer;

      try {
        decodedBytes = Buffer.from(attachment.content, 'base64');
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Attachment content must be valid base64',
          path: ['attachments', index, 'content'],
        });
        continue;
      }

      if (decodedBytes.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Attachment content cannot be empty',
          path: ['attachments', index, 'content'],
        });
        continue;
      }

      if (decodedBytes.length > MAX_ATTACHMENT_BYTES) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Attachment exceeds maximum size of ${MAX_ATTACHMENT_BYTES} bytes`,
          path: ['attachments', index, 'content'],
        });
      }

      totalBytes += decodedBytes.length;
    }

    if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Total attachment size exceeds maximum of ${MAX_TOTAL_ATTACHMENT_BYTES} bytes`,
        path: ['attachments'],
      });
    }
  });

export type SendEmail = z.infer<typeof SendEmailSchema>;

export const SendEmailResponseSchema = z.object({
  id: z.string().describe('Resend message identifier'),
  status: z.literal('queued').describe('Initial delivery status reported by Resend'),
});

export type SendEmailResponse = z.infer<typeof SendEmailResponseSchema>;
