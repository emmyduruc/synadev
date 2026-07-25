import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { AuthenticatedClerkUser } from './auth.types';

type RequestWithAuth = {
  clerkUser?: AuthenticatedClerkUser;
};

export const CurrentClerkUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedClerkUser => {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    if (!request.clerkUser) {
      throw new Error('CurrentClerkUser used outside ClerkAuthGuard');
    }

    return request.clerkUser;
  },
);
