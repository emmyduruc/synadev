import {
  CyclePhaseSnapshotSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class CyclePhaseSnapshotResponseDto extends createZodDto(
  CyclePhaseSnapshotSchema,
) {}
