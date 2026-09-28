/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Mood entries: optional medication_change flag for entry-screen mood tab.
 */
export class AddMoodMedicationChange1753439900000 implements MigrationInterface {
  name = 'AddMoodMedicationChange1753439900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "mood_entries"
        ADD COLUMN IF NOT EXISTS "medication_change" boolean
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "mood_entries"
        DROP COLUMN IF EXISTS "medication_change"
    `);
  }
}
