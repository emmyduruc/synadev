import { randomUUID } from 'node:crypto';

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
  type AllowedImageMimeType,
  type UploadImageResponse,
} from '@syna/shared-types';

const isAllowedImageMimeType = (mimeType: string): mimeType is AllowedImageMimeType =>
  (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);

@Injectable()
export class UploadsService {
  uploadImage(file: Express.Multer.File, altText?: string): UploadImageResponse {
    if (!file) {
      throw new BadRequestException('A file is required');
    }

    if (!isAllowedImageMimeType(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type. Allowed: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      throw new BadRequestException(
        `File exceeds maximum size of ${MAX_IMAGE_UPLOAD_BYTES} bytes`,
      );
    }

    return {
      id: randomUUID(),
      filename: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      url: `https://cdn.syna.app/uploads/${randomUUID()}/${file.originalname}`,
      altText,
      uploadedAt: new Date().toISOString(),
    };
  }
}
