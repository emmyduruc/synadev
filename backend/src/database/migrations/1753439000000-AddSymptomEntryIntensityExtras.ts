/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Rich symptom day entries (intensity + optional extras), nocturia, and chills catalog rows.
 */
export class AddSymptomEntryIntensityExtras1753439000000
  implements MigrationInterface
{
  name = 'AddSymptomEntryIntensityExtras1753439000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "symptom_entries"
        ADD COLUMN IF NOT EXISTS "intensity" smallint NOT NULL DEFAULT 2
    `);

    await queryRunner.query(`
      ALTER TABLE "symptom_entries"
        ADD COLUMN IF NOT EXISTS "extras" jsonb
    `);

    await queryRunner.query(`
      ALTER TABLE "symptom_entries"
        DROP CONSTRAINT IF EXISTS "CHK_symptom_entries_intensity"
    `);

    await queryRunner.query(`
      ALTER TABLE "symptom_entries"
        ADD CONSTRAINT "CHK_symptom_entries_intensity"
        CHECK ("intensity" >= 0 AND "intensity" <= 4)
    `);

    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order")
      VALUES
        ('nocturia', 'urogenital', 35),
        ('chills', 'vasomotor', 4)
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "symptom_entries" WHERE "symptom_id" IN ('nocturia', 'chills')
    `);
    await queryRunner.query(`
      DELETE FROM "symptoms" WHERE "id" IN ('nocturia', 'chills')
    `);
    await queryRunner.query(`
      ALTER TABLE "symptom_entries"
        DROP CONSTRAINT IF EXISTS "CHK_symptom_entries_intensity"
    `);
    await queryRunner.query(`
      ALTER TABLE "symptom_entries" DROP COLUMN IF EXISTS "extras"
    `);
    await queryRunner.query(`
      ALTER TABLE "symptom_entries" DROP COLUMN IF EXISTS "intensity"
    `);
  }
}
