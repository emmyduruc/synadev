/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserHealthRecordAndPhq2Instrument1753437000000
  implements MigrationInterface
{
  name = 'AddUserHealthRecordAndPhq2Instrument1753437000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "health_record" jsonb
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_submissions"
      DROP CONSTRAINT IF EXISTS "CHK_assessment_submissions_instrument"
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_submissions"
      ADD CONSTRAINT "CHK_assessment_submissions_instrument"
      CHECK ("instrument" IN ('mrs_ii', 'pam13', 'phq2'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assessment_submissions"
      DROP CONSTRAINT IF EXISTS "CHK_assessment_submissions_instrument"
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_submissions"
      ADD CONSTRAINT "CHK_assessment_submissions_instrument"
      CHECK ("instrument" IN ('mrs_ii', 'pam13'))
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "health_record"
    `);
  }
}
