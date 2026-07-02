import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ApiErrorDto } from '../dto/api-error.dto';

type ApiStandardResponsesOptions = {
  badRequest?: boolean;
  unauthorized?: boolean;
  notFound?: boolean;
  conflict?: boolean;
};

export const ApiStandardResponses = ({
  badRequest = true,
  unauthorized = false,
  notFound = false,
  conflict = false,
}: ApiStandardResponsesOptions = {}) => {
  const decorators = [];

  if (badRequest) {
    decorators.push(
      ApiResponse({
        status: 400,
        description: 'Request validation failed — see errors array for field-level details',
        type: ApiErrorDto,
      }),
    );
  }

  if (unauthorized) {
    decorators.push(
      ApiResponse({
        status: 401,
        description: 'Authentication required or token is invalid',
        type: ApiErrorDto,
      }),
    );
  }

  if (notFound) {
    decorators.push(
      ApiResponse({
        status: 404,
        description: 'Requested resource was not found',
        type: ApiErrorDto,
      }),
    );
  }

  if (conflict) {
    decorators.push(
      ApiResponse({
        status: 409,
        description: 'Resource conflict — e.g. duplicate email',
        type: ApiErrorDto,
      }),
    );
  }

  return applyDecorators(...decorators);
};
