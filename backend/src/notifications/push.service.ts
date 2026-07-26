import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { RegisterPushToken } from '@syna/shared-types';
import { Expo, type ExpoPushMessage } from 'expo-server-sdk';
import { Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { PushTokenEntity } from './push-token.entity';

export type PushPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly expo = new Expo();

  constructor(
    @InjectRepository(PushTokenEntity)
    private readonly pushTokensRepository: Repository<PushTokenEntity>,
    private readonly usersService: UsersService,
  ) {}

  async registerToken(
    clerkUser: AuthenticatedClerkUser,
    input: RegisterPushToken,
  ): Promise<{ ok: true }> {
    if (input.locale) {
      await this.usersService.updateCurrentUserLocale(clerkUser, input.locale);
    }

    const userId = await this.usersService.resolveUserId(clerkUser);

    if (!Expo.isExpoPushToken(input.token)) {
      this.logger.warn(`Rejected non-Expo push token for user ${userId}`);
      return { ok: true };
    }

    const existing = await this.pushTokensRepository.findOne({
      where: { token: input.token },
    });

    if (existing) {
      existing.userId = userId;
      existing.platform = input.platform;
      await this.pushTokensRepository.save(existing);
      return { ok: true };
    }

    await this.pushTokensRepository.save(
      this.pushTokensRepository.create({
        userId,
        token: input.token,
        platform: input.platform,
      }),
    );

    return { ok: true };
  }

  async sendToUser(userId: string, payload: PushPayload): Promise<void> {
    const tokens = await this.pushTokensRepository.find({ where: { userId } });

    if (tokens.length === 0) {
      return;
    }

    const messages: ExpoPushMessage[] = tokens
      .filter((row) => Expo.isExpoPushToken(row.token))
      .map((row) => ({
        to: row.token,
        sound: 'default' as const,
        title: payload.title,
        body: payload.body,
        data: payload.data,
      }));

    if (messages.length === 0) {
      return;
    }

    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        this.logger.warn(
          `Expo push chunk failed for user ${userId}: ${
            error instanceof Error ? error.message : 'unknown error'
          }`,
        );
      }
    }
  }
}
