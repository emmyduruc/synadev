import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  AppLocale,
  UpdateUserHealthMetrics,
  UpdateUserHealthRecord,
  UpdateUserProfile,
  User,
} from '@syna/shared-types';
import { DEFAULT_APP_LOCALE } from '@syna/shared-types';
import { Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';

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
}
