/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHealthDailyMetrics1753436000000 implements MigrationInterface {
  name = 'CreateHealthDailyMetrics1753436000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "health_daily_metrics" (
        "user_id" uuid NOT NULL,
        "log_date" date NOT NULL,
        "platform" character varying(64) NOT NULL,
        "metrics" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "synced_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_health_daily_metrics" PRIMARY KEY ("user_id", "log_date"),
        CONSTRAINT "FK_health_daily_metrics_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_health_daily_metrics_user_date"
        ON "health_daily_metrics" ("user_id", "log_date")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_health_daily_metrics_user_date"`);
    await queryRunner.query(`DROP TABLE "health_daily_metrics"`);
  }
}
