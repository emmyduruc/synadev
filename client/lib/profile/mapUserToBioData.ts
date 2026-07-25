import type { User } from '@syna/shared-types';

import type { BioData } from '@/lib/profile/bioDataStorage';

export const mapUserToBioData = (user: User): BioData => ({
  firstName: user.firstName ?? '',
  lastName: user.lastName ?? '',
  dateOfBirth: user.dateOfBirth ?? '',
  address: user.address ?? '',
});
