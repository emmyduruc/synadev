import {
  ReplaceSymptomLogsSchema,
  SymptomCatalogSchema,
  SymptomLogsSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class SymptomLogsDto extends createZodDto(SymptomLogsSchema) {}

export class ReplaceSymptomLogsDto extends createZodDto(ReplaceSymptomLogsSchema) {}

export class SymptomCatalogDto extends createZodDto(SymptomCatalogSchema) {}
