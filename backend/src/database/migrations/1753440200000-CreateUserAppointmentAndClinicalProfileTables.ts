/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Doctor appointment (one upcoming visit per user) + clinical deepening profile.
 */
export class CreateUserAppointmentAndClinicalProfileTables1753440200000
  implements MigrationInterface
{
  name = 'CreateUserAppointmentAndClinicalProfileTables1753440200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_appointments" (
        "user_id" uuid NOT NULL,
        "appointment_date" date NULL,
        "appointment_time" character varying(5) NULL,
        "doctor_name" character varying(200) NULL,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_appointments" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_user_appointments_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_clinical_profiles" (
        "user_id" uuid NOT NULL,
        "uterus_removed" boolean NULL,
        "ovaries_removed" boolean NULL,
        "endometrial_ablation" boolean NULL,
        "hormone_iud" boolean NULL,
        "hormonal_contraception" boolean NULL,
        "hormone_therapy" boolean NULL,
        "thyroid_disease" boolean NULL,
        "age_at_first_period" smallint NULL,
        "persistent_complaint_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "gynecological_history_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "general_condition_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "medication_topic_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "lifestyle_topic_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "family_history_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_clinical_profiles" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_user_clinical_profiles_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_clinical_profiles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_appointments"`);
  }
}
