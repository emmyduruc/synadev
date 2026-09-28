/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cycle & Bleeding catalog: bleeding seed; keep spotting + cramps as the
 * visible set (flow_* / blood_clots remain for legacy logs).
 */
export class SyncCycleBleedingCatalog1753439500000 implements MigrationInterface {
  name = 'SyncCycleBleedingCatalog1753439500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order")
      VALUES ('bleeding', 'cycle', 1)
      ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cycle', "sort_order" = 1
      WHERE "id" = 'bleeding'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cycle', "sort_order" = 2
      WHERE "id" = 'spotting'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cycle', "sort_order" = 3
      WHERE "id" = 'cramps'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 90
      WHERE "id" IN ('flow_light', 'flow_medium', 'flow_heavy', 'blood_clots')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 1
      WHERE "id" = 'flow_light'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 2
      WHERE "id" = 'flow_medium'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 3
      WHERE "id" = 'flow_heavy'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 4
      WHERE "id" = 'blood_clots'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 5
      WHERE "id" = 'spotting'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 6
      WHERE "id" = 'cramps'
    `);

    await queryRunner.query(`
      DELETE FROM "symptom_entries" WHERE "symptom_id" = 'bleeding'
    `);

    await queryRunner.query(`
      DELETE FROM "symptoms" WHERE "id" = 'bleeding'
    `);
  }
}
