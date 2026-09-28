/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cognition catalog: brain fog, concentration, word finding, forgetfulness.
 */
export class SyncCognitionCatalog1753439700000 implements MigrationInterface {
  name = 'SyncCognitionCatalog1753439700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order") VALUES
        ('concentration_problems', 'cognition', 2),
        ('word_finding', 'cognition', 3)
      ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cognition', "sort_order" = 1
      WHERE "id" = 'brain_fog'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cognition', "sort_order" = 2
      WHERE "id" = 'concentration_problems'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cognition', "sort_order" = 3
      WHERE "id" = 'word_finding'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cognition', "sort_order" = 4
      WHERE "id" = 'forgetfulness'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cognition', "sort_order" = 1
      WHERE "id" = 'forgetfulness'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cognition', "sort_order" = 2
      WHERE "id" = 'brain_fog'
    `);

    await queryRunner.query(`
      DELETE FROM "symptom_entries"
      WHERE "symptom_id" IN ('concentration_problems', 'word_finding')
    `);

    await queryRunner.query(`
      DELETE FROM "symptoms"
      WHERE "id" IN ('concentration_problems', 'word_finding')
    `);
  }
}
