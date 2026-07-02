import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiFileUpload } from '../common/decorators/api-file-upload.decorator';
import { ApiStandardResponses } from '../common/decorators/api-standard-responses.decorator';
import { SWAGGER_TAGS } from '../swagger/swagger.constants';

import { UploadImageResponseDto } from './dto/upload.dto';
import { UploadsService } from './uploads.service';

@ApiTags(SWAGGER_TAGS.uploads)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload an image',
    description:
      'Uploads a profile or health-related image. ' +
      'Accepts JPEG, PNG, WebP, and HEIC up to 10 MB. ' +
      'Returns metadata and a CDN URL for the stored file.',
  })
  @ApiFileUpload({
    fieldName: 'file',
    description: 'Multipart form with a binary image file and optional altText field',
    extraFields: {
      altText: {
        type: 'string',
        description: 'Optional accessible description for the image',
        maxLength: 200,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Image uploaded successfully',
    type: UploadImageResponseDto,
  })
  @ApiStandardResponses()
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('altText') altText?: string,
  ): UploadImageResponseDto {
    return this.uploadsService.uploadImage(file, altText);
  }
}
