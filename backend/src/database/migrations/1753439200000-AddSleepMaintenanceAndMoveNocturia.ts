/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Sleep & Energy catalog: sleep_maintenance (Durchschlafprobleme)
 * and move nocturia under sleep_energy to match entry UI.
 */
export class AddSleepMaintenanceAndMoveNocturia1753439200000
  implements MigrationInterface
{
  name = 'AddSleepMaintenanceAndMoveNocturia1753439200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order")
      VALUES ('sleep_maintenance', 'sleep_energy', 15)
      ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'sleep_energy', "sort_order" = 40
      WHERE "id" = 'nocturia'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'urogenital', "sort_order" = 35
      WHERE "id" = 'nocturia'
    `);

    await queryRunner.query(`
      DELETE FROM "symptom_entries" WHERE "symptom_id" = 'sleep_maintenance'
    `);

    await queryRunner.query(`
      DELETE FROM "symptoms" WHERE "id" = 'sleep_maintenance'
    `);
  }
}
