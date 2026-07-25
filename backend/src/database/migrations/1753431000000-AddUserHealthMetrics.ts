/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserHealthMetrics1753431000000 implements MigrationInterface {
  name = 'AddUserHealthMetrics1753431000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "health_metrics" jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "health_metrics"
    `);
  }
}
