/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssessmentTables1753435000000 implements MigrationInterface {
  name = 'CreateAssessmentTables1753435000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "assessment_submissions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "instrument" character varying(32) NOT NULL,
        "assessment_id" character varying(64) NOT NULL,
        "timepoint" character varying(8) NOT NULL,
        "total_score" smallint,
        "scaled_score" real,
        "somatic" smallint,
        "psychological" smallint,
        "urogenital" smallint,
        "completed_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_assessment_submissions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_assessment_submissions_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_assessment_submissions_instrument"
          CHECK ("instrument" IN ('mrs_ii', 'pam13'))
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_assessment_submissions_user_instrument_completed"
      ON "assessment_submissions" ("user_id", "instrument", "completed_at" DESC)
    `);

    await queryRunner.query(`
      CREATE TABLE "assessment_answers" (
        "submission_id" uuid NOT NULL,
        "item_key" character varying(64) NOT NULL,
        "item_index" smallint NOT NULL,
        "value" smallint NOT NULL,
        CONSTRAINT "PK_assessment_answers" PRIMARY KEY ("submission_id", "item_key"),
        CONSTRAINT "FK_assessment_answers_submission"
          FOREIGN KEY ("submission_id") REFERENCES "assessment_submissions"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_assessment_answers_submission_index"
          UNIQUE ("submission_id", "item_index")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "assessment_answers"`);
    await queryRunner.query(`DROP TABLE "assessment_submissions"`);
  }
}
