/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCycleStateAndPushTokens1753433000000 implements MigrationInterface {
  name = 'CreateCycleStateAndPushTokens1753433000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_cycle_state" (
        "user_id" uuid NOT NULL,
        "current_phase" character varying(32),
        "cycle_day" smallint,
        "period_start_date" date,
        "next_period_date" date,
        "cycle_length_days" smallint NOT NULL DEFAULT 28,
        "period_length_days" smallint NOT NULL DEFAULT 5,
        "notified_phase" character varying(32),
        "notified_at" TIMESTAMPTZ,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_cycle_state" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_user_cycle_state_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "push_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "token" character varying(512) NOT NULL,
        "platform" character varying(16) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_push_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_push_tokens_token" UNIQUE ("token"),
        CONSTRAINT "FK_push_tokens_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_push_tokens_user_id" ON "push_tokens" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "push_tokens"`);
    await queryRunner.query(`DROP TABLE "user_cycle_state"`);
  }
}
