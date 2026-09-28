import {
  CreateCustomSymptomSchema,
  CustomSymptomSchema,
  CustomSymptomsSchema,
  ReplaceSymptomFavoritesSchema,
  ReplaceSymptomLogsSchema,
  SymptomCatalogSchema,
  SymptomFavoritesSchema,
  SymptomLogsSchema,
} from '@syna/shared-types';
import { createZodDto } from 'nestjs-zod';

export class SymptomLogsDto extends createZodDto(SymptomLogsSchema) {}

export class ReplaceSymptomLogsDto extends createZodDto(ReplaceSymptomLogsSchema) {}

export class SymptomCatalogDto extends createZodDto(SymptomCatalogSchema) {}

export class CustomSymptomDto extends createZodDto(CustomSymptomSchema) {}

export class CustomSymptomsDto extends createZodDto(CustomSymptomsSchema) {}

export class CreateCustomSymptomDto extends createZodDto(CreateCustomSymptomSchema) {}

export class SymptomFavoritesDto extends createZodDto(SymptomFavoritesSchema) {}

export class ReplaceSymptomFavoritesDto extends createZodDto(ReplaceSymptomFavoritesSchema) {}
