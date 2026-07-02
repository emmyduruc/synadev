import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

type ApiFileUploadOptions = {
  fieldName?: string;
  description: string;
  extraFields?: Record<string, Record<string, unknown>>;
};

export const ApiFileUpload = ({
  fieldName = 'file',
  description,
  extraFields = {},
}: ApiFileUploadOptions) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description,
      required: true,
      schema: {
        type: 'object',
        required: [fieldName],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
            description: 'Binary file content',
          },
          ...extraFields,
        },
      },
    }),
  );
