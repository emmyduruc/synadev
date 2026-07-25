import { createClerkClient, verifyToken } from '@clerk/backend';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import type { AuthenticatedClerkUser } from './auth.types';
import { parseClerkEnv } from './clerk.config';

type RequestWithAuth = Request & {
  clerkUser?: AuthenticatedClerkUser;
};

const extractBearerToken = (request: Request): string | null => {
  const header = request.headers.authorization;

  if (!header || typeof header !== 'string') {
    return null;
  }

  const [scheme, token] = header.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const { CLERK_SECRET_KEY } = parseClerkEnv();

    try {
      const payload = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
      const clerkId = payload.sub;

      if (!clerkId) {
        throw new UnauthorizedException('Invalid token subject');
      }

      const emailFromToken =
        typeof payload.email === 'string' && payload.email.length > 0
          ? payload.email
          : null;

      if (emailFromToken) {
        request.clerkUser = {
          clerkId,
          email: emailFromToken,
        };
        return true;
      }

      const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });
      const clerkUser = await clerk.users.getUser(clerkId);
      const primaryEmail =
        clerkUser.emailAddresses.find(
          (entry) => entry.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

      if (!primaryEmail) {
        throw new UnauthorizedException('Clerk user has no email address');
      }

      request.clerkUser = {
        clerkId,
        email: primaryEmail,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }
}
