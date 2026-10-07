/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Normalized report-tab preferences: period range, doctor questions, concerns.
 * Junction tables stay 1NF for multi-select; freitext lives on the preferences row.
 */
export class CreateUserReportPreferenceTables1753440100000
  implements MigrationInterface
{
  name = 'CreateUserReportPreferenceTables1753440100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_report_preferences" (
        "user_id" uuid NOT NULL,
        "period_preset" character varying(32) NULL,
        "period_from_date" date NULL,
        "period_to_date" date NULL,
        "concern_free_text" text NULL,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_report_preferences" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_user_report_preferences_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_report_doctor_question_selections" (
        "user_id" uuid NOT NULL,
        "question_id" character varying(64) NOT NULL,
        "sort_order" smallint NOT NULL DEFAULT 0,
        CONSTRAINT "PK_user_report_doctor_question_selections"
          PRIMARY KEY ("user_id", "question_id"),
        CONSTRAINT "FK_user_report_doctor_question_selections_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_report_custom_doctor_questions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "question_text" character varying(500) NOT NULL,
        "sort_order" smallint NOT NULL DEFAULT 0,
        CONSTRAINT "PK_user_report_custom_doctor_questions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_report_custom_doctor_questions_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_report_custom_doctor_questions_user"
        ON "user_report_custom_doctor_questions" ("user_id")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_report_concern_selections" (
        "user_id" uuid NOT NULL,
        "concern_id" character varying(64) NOT NULL,
        "sort_order" smallint NOT NULL DEFAULT 0,
        CONSTRAINT "PK_user_report_concern_selections"
          PRIMARY KEY ("user_id", "concern_id"),
        CONSTRAINT "FK_user_report_concern_selections_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_report_concern_selections"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_report_custom_doctor_questions"`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "user_report_doctor_question_selections"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "user_report_preferences"`);
  }
}
