import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Extends period_days with bleeding detail fields used by the period log UI.
 */
export class AddPeriodDayBleedingDetails1753440300000
  implements MigrationInterface
{
  name = 'AddPeriodDayBleedingDetails1753440300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "period_days"
      ADD COLUMN "is_first_day" boolean,
      ADD COLUMN "bleeding_type" character varying(32),
      ADD COLUMN "strength" character varying(16),
      ADD COLUMN "observations" jsonb NOT NULL DEFAULT '[]'::jsonb,
      ADD COLUMN "notes" text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "period_days"
      DROP COLUMN "notes",
      DROP COLUMN "observations",
      DROP COLUMN "strength",
      DROP COLUMN "bleeding_type",
      DROP COLUMN "is_first_day"
    `);
  }
}
