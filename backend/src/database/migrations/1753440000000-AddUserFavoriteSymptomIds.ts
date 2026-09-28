/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Persist symptom favorites on the user row so devices share the same quick-access list.
 */
export class AddUserFavoriteSymptomIds1753440000000 implements MigrationInterface {
  name = 'AddUserFavoriteSymptomIds1753440000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "favorite_symptom_ids" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "favorite_symptom_ids"
    `);
  }
}
