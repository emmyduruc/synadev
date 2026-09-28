/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Mood & Psyche: inner_restlessness seed; move brain_fog under cognition.
 */
export class AddInnerRestlessnessAndMoveBrainFog1753439300000
  implements MigrationInterface
{
  name = 'AddInnerRestlessnessAndMoveBrainFog1753439300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order")
      VALUES ('inner_restlessness', 'mood', 25)
      ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'cognition', "sort_order" = 2
      WHERE "id" = 'brain_fog'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'mood', "sort_order" = 6
      WHERE "id" = 'brain_fog'
    `);

    await queryRunner.query(`
      DELETE FROM "symptom_entries" WHERE "symptom_id" = 'inner_restlessness'
    `);

    await queryRunner.query(`
      DELETE FROM "symptoms" WHERE "id" = 'inner_restlessness'
    `);
  }
}
