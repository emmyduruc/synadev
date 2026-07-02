import { z } from 'zod';

export const UploadImageResponseSchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the uploaded file'),
  filename: z.string().describe('Original filename of the uploaded image'),
  mimeType: z.string().describe('Detected MIME type of the uploaded file'),
  sizeBytes: z.number().int().describe('File size in bytes'),
  url: z.string().url().describe('Public URL to access the uploaded image'),
  altText: z
    .string()
    .optional()
    .describe('Optional accessible description provided during upload'),
  uploadedAt: z.string().datetime().describe('ISO 8601 timestamp when the file was uploaded'),
});

export type UploadImageResponse = z.infer<typeof UploadImageResponseSchema>;

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
