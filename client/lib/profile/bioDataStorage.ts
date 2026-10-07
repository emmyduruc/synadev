import * as SecureStore from 'expo-secure-store';

const BIO_DATA_STORAGE_KEY = 'profile_bio_data';

export type BioData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
};

type StoredBioPayload = BioData & {
  ownerClerkId: string;
};

export const EMPTY_BIO_DATA: BioData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  address: '',
};

export const BIO_DATA_FIELD = {
  firstName: 'first_name',
  lastName: 'last_name',
  dateOfBirth: 'date_of_birth',
  address: 'address',
} as const;

export type BioDataFieldId = (typeof BIO_DATA_FIELD)[keyof typeof BIO_DATA_FIELD];

export const BIO_DATA_REQUIRED_FIELDS: readonly BioDataFieldId[] = [
  BIO_DATA_FIELD.firstName,
  BIO_DATA_FIELD.lastName,
  BIO_DATA_FIELD.dateOfBirth,
];

/** Bumped on sign-out / delete so in-flight writes cannot restore a previous account. */
let writeGeneration = 0;

export const invalidateBioDataWrites = (): void => {
  writeGeneration += 1;
};

const isBioDataShape = (value: unknown): value is BioData => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.firstName === 'string'
    && typeof record.lastName === 'string'
    && typeof record.dateOfBirth === 'string'
    && typeof record.address === 'string'
  );
};

const toBioData = (value: BioData): BioData => ({
  firstName: value.firstName,
  lastName: value.lastName,
  dateOfBirth: value.dateOfBirth,
  address: value.address,
});

const parseStoredPayload = (raw: string): StoredBioPayload | null => {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isBioDataShape(parsed)) {
      return null;
    }

    const record = parsed as BioData & { ownerClerkId?: unknown };
    const ownerClerkId =
      typeof record.ownerClerkId === 'string' && record.ownerClerkId.trim().length > 0
        ? record.ownerClerkId.trim()
        : null;

    if (!ownerClerkId) {
      // Legacy unscoped cache from a previous install — never reuse across accounts.
      return null;
    }

    return {
      ...toBioData(record),
      ownerClerkId,
    };
  } catch {
    return null;
  }
};

/**
 * Loads bio only when it belongs to this Clerk user.
 * Missing or foreign cache → empty (forces onboarding for a new account on the same device).
 */
export const loadBioDataForClerkUser = async (clerkUserId: string): Promise<BioData> => {
  if (!clerkUserId.trim()) {
    return EMPTY_BIO_DATA;
  }

  const raw = await SecureStore.getItemAsync(BIO_DATA_STORAGE_KEY);

  if (!raw) {
    return EMPTY_BIO_DATA;
  }

  const stored = parseStoredPayload(raw);

  if (!stored || stored.ownerClerkId !== clerkUserId) {
    return EMPTY_BIO_DATA;
  }

  return toBioData(stored);
};

/** @deprecated Prefer loadBioDataForClerkUser — unscoped reads always return empty. */
export const loadBioData = async (): Promise<BioData> => EMPTY_BIO_DATA;

export const saveBioData = async (
  bioData: BioData,
  ownerClerkId: string,
): Promise<void> => {
  const generation = writeGeneration;
  const owner = ownerClerkId.trim();

  if (!owner) {
    return;
  }

  const isEmpty =
    !bioData.firstName.trim()
    && !bioData.lastName.trim()
    && !bioData.dateOfBirth
    && !bioData.address.trim();

  if (isEmpty) {
    if (generation !== writeGeneration) {
      return;
    }

    await clearBioData();
    return;
  }

  if (generation !== writeGeneration) {
    return;
  }

  const payload: StoredBioPayload = {
    ...toBioData(bioData),
    ownerClerkId: owner,
  };

  await SecureStore.setItemAsync(BIO_DATA_STORAGE_KEY, JSON.stringify(payload));
};

/** Clears the local cache — used when DB has no bio (null / incomplete). */
export const clearBioData = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(BIO_DATA_STORAGE_KEY);
};

export const isBioFieldFilled = (bioData: BioData, fieldId: BioDataFieldId): boolean => {
  switch (fieldId) {
    case BIO_DATA_FIELD.firstName:
      return bioData.firstName.trim().length > 0;
    case BIO_DATA_FIELD.lastName:
      return bioData.lastName.trim().length > 0;
    case BIO_DATA_FIELD.dateOfBirth:
      return bioData.dateOfBirth.length > 0;
    case BIO_DATA_FIELD.address:
      return bioData.address.trim().length > 0;
    default:
      return false;
  }
};

export const isBioDataComplete = (bioData: BioData): boolean =>
  BIO_DATA_REQUIRED_FIELDS.every((fieldId) => isBioFieldFilled(bioData, fieldId));

export const getBioDataCompletionPercent = (bioData: BioData): number => {
  const filledCount = BIO_DATA_REQUIRED_FIELDS.filter((fieldId) =>
    isBioFieldFilled(bioData, fieldId),
  ).length;

  return Math.round((filledCount / BIO_DATA_REQUIRED_FIELDS.length) * 100);
};
