import type { UpdateUserProfile, User } from '@syna/shared-types';

import type { UserEntity } from './user.entity';

const toIsoDateString = (value: string | Date | null): string | null => {
  if (value === null) {
    return null;
  }

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

export const isUserBioComplete = (user: {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | Date | null;
}): boolean =>
  Boolean(user.firstName?.trim()) &&
  Boolean(user.lastName?.trim()) &&
  Boolean(toIsoDateString(user.dateOfBirth));

export const mapUserEntityToDto = (entity: UserEntity): User => ({
  id: entity.id,
  clerkId: entity.clerkId,
  email: entity.email,
  firstName: entity.firstName,
  lastName: entity.lastName,
  dateOfBirth: toIsoDateString(entity.dateOfBirth),
  address: entity.address,
  isBioComplete: isUserBioComplete(entity),
  createdAt: entity.createdAt.toISOString(),
  updatedAt: entity.updatedAt.toISOString(),
});

export const applyProfileUpdate = (
  entity: UserEntity,
  input: UpdateUserProfile,
): void => {
  entity.firstName = input.firstName;
  entity.lastName = input.lastName;
  entity.dateOfBirth = input.dateOfBirth;
  entity.address = input.address?.trim() ? input.address.trim() : entity.address;
};
