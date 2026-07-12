import * as SecureStore from 'expo-secure-store';

const BIO_DATA_STORAGE_KEY = 'profile_bio_data';

export type BioData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
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

export const loadBioData = async (): Promise<BioData> => {
  const raw = await SecureStore.getItemAsync(BIO_DATA_STORAGE_KEY);

  if (!raw) {
    return EMPTY_BIO_DATA;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isBioDataShape(parsed)) {
      return EMPTY_BIO_DATA;
    }

    return parsed;
  } catch {
    return EMPTY_BIO_DATA;
  }
};

export const saveBioData = async (bioData: BioData): Promise<void> => {
  await SecureStore.setItemAsync(BIO_DATA_STORAGE_KEY, JSON.stringify(bioData));
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
