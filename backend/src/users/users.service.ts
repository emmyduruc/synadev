import { createClerkClient } from '@clerk/backend';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  AppLocale,
  DeleteAccountResult,
  UpdateUserHealthMetrics,
  UpdateUserHealthRecord,
  UpdateUserProfile,
  User,
} from '@syna/shared-types';
import { DEFAULT_APP_LOCALE } from '@syna/shared-types';
import { Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { parseClerkEnv } from '../auth/clerk.config';

import { UserEntity } from './user.entity';
import {
  applyHealthMetricsUpdate,
  applyHealthRecordUpdate,
  applyLocaleUpdate,
  applyProfileUpdate,
  mapUserEntityToDto,
} from './user.mapper';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /**
   * Idempotent upsert keyed by clerk_id — creates the Syna user row on first API call.
   */
  async ensureCurrentUser(clerkUser: AuthenticatedClerkUser): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { clerkId: clerkUser.clerkId },
    });

    if (existing) {
      if (existing.email !== clerkUser.email) {
        existing.email = clerkUser.email;
        const saved = await this.usersRepository.save(existing);
        return mapUserEntityToDto(saved);
      }

      return mapUserEntityToDto(existing);
    }

    const created = this.usersRepository.create({
      clerkId: clerkUser.clerkId,
      email: clerkUser.email,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      address: null,
      locale: DEFAULT_APP_LOCALE,
      healthMetrics: null,
      healthRecord: null,
      favoriteSymptomIds: [],
    });

    const saved = await this.usersRepository.save(created);
    return mapUserEntityToDto(saved);
  }

  async updateCurrentUserProfile(
    clerkUser: AuthenticatedClerkUser,
    input: UpdateUserProfile,
  ): Promise<User> {
    await this.ensureCurrentUser(clerkUser);

    const entity = await this.usersRepository.findOneOrFail({
      where: { clerkId: clerkUser.clerkId },
    });

    applyProfileUpdate(entity, input);
    const saved = await this.usersRepository.save(entity);
    return mapUserEntityToDto(saved);
  }

  async updateCurrentUserHealthMetrics(
    clerkUser: AuthenticatedClerkUser,
    input: UpdateUserHealthMetrics,
  ): Promise<User> {
    await this.ensureCurrentUser(clerkUser);

    const entity = await this.usersRepository.findOneOrFail({
      where: { clerkId: clerkUser.clerkId },
    });

    applyHealthMetricsUpdate(entity, input);
    const saved = await this.usersRepository.save(entity);
    return mapUserEntityToDto(saved);
  }

  async updateCurrentUserHealthRecord(
    clerkUser: AuthenticatedClerkUser,
    input: UpdateUserHealthRecord,
  ): Promise<User> {
    await this.ensureCurrentUser(clerkUser);

    const entity = await this.usersRepository.findOneOrFail({
      where: { clerkId: clerkUser.clerkId },
    });

    applyHealthRecordUpdate(entity, input);
    const saved = await this.usersRepository.save(entity);
    return mapUserEntityToDto(saved);
  }

  async updateCurrentUserLocale(
    clerkUser: AuthenticatedClerkUser,
    locale: AppLocale,
  ): Promise<User> {
    await this.ensureCurrentUser(clerkUser);

    const entity = await this.usersRepository.findOneOrFail({
      where: { clerkId: clerkUser.clerkId },
    });

    applyLocaleUpdate(entity, locale);
    const saved = await this.usersRepository.save(entity);
    return mapUserEntityToDto(saved);
  }

  /** Ensures the Syna user exists and returns their primary key. */
  async resolveUserId(clerkUser: AuthenticatedClerkUser): Promise<string> {
    const user = await this.ensureCurrentUser(clerkUser);
    return user.id;
  }

  async getFavoriteSymptomIds(clerkUser: AuthenticatedClerkUser): Promise<string[]> {
    await this.ensureCurrentUser(clerkUser);

    const entity = await this.usersRepository.findOneOrFail({
      where: { clerkId: clerkUser.clerkId },
    });

    return Array.isArray(entity.favoriteSymptomIds) ? [...entity.favoriteSymptomIds] : [];
  }

  async replaceFavoriteSymptomIds(
    clerkUser: AuthenticatedClerkUser,
    symptomIds: readonly string[],
  ): Promise<string[]> {
    await this.ensureCurrentUser(clerkUser);

    const entity = await this.usersRepository.findOneOrFail({
      where: { clerkId: clerkUser.clerkId },
    });

    entity.favoriteSymptomIds = [...symptomIds];
    const saved = await this.usersRepository.save(entity);

    return Array.isArray(saved.favoriteSymptomIds) ? [...saved.favoriteSymptomIds] : [];
  }

  /**
   * Deletes the Syna user row (CASCADE clears related app data) and the Clerk identity.
   */
  async deleteCurrentAccount(
    clerkUser: AuthenticatedClerkUser,
  ): Promise<DeleteAccountResult> {
    const entity = await this.usersRepository.findOne({
      where: { clerkId: clerkUser.clerkId },
    });

    if (entity) {
      await this.usersRepository.delete({ id: entity.id });
    }

    const { CLERK_SECRET_KEY } = parseClerkEnv();
    const clerk = createClerkClient({ secretKey: CLERK_SECRET_KEY });

    try {
      await clerk.users.deleteUser(clerkUser.clerkId);
    } catch (error) {
      this.logger.error(
        `Failed to delete Clerk user ${clerkUser.clerkId} after Syna row removal`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }

    return { deleted: true };
  }
}
