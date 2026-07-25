/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 1NF cycle / mood / symptoms tables + seeded symptom catalog.
 */
export class CreateCycleMoodSymptomTables1753432000000 implements MigrationInterface {
  name = 'CreateCycleMoodSymptomTables1753432000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "period_days" (
        "user_id" uuid NOT NULL,
        "log_date" date NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_period_days" PRIMARY KEY ("user_id", "log_date"),
        CONSTRAINT "FK_period_days_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "mood_entries" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "log_date" date NOT NULL,
        "primary_mood_id" character varying(32),
        "energy" smallint NOT NULL DEFAULT 0,
        "stress" smallint NOT NULL DEFAULT 0,
        "note" text NOT NULL DEFAULT '',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_mood_entries" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_mood_entries_user_date" UNIQUE ("user_id", "log_date"),
        CONSTRAINT "FK_mood_entries_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_mood_entries_energy" CHECK ("energy" >= 0 AND "energy" <= 5),
        CONSTRAINT "CHK_mood_entries_stress" CHECK ("stress" >= 0 AND "stress" <= 5)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "mood_entry_feelings" (
        "mood_entry_id" uuid NOT NULL,
        "feeling_id" character varying(32) NOT NULL,
        CONSTRAINT "PK_mood_entry_feelings" PRIMARY KEY ("mood_entry_id", "feeling_id"),
        CONSTRAINT "FK_mood_entry_feelings_entry"
          FOREIGN KEY ("mood_entry_id") REFERENCES "mood_entries"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "symptom_categories" (
        "id" character varying(32) NOT NULL,
        "sort_order" smallint NOT NULL DEFAULT 0,
        CONSTRAINT "PK_symptom_categories" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "symptoms" (
        "id" character varying(64) NOT NULL,
        "category_id" character varying(32) NOT NULL,
        "sort_order" smallint NOT NULL DEFAULT 0,
        CONSTRAINT "PK_symptoms" PRIMARY KEY ("id"),
        CONSTRAINT "FK_symptoms_category"
          FOREIGN KEY ("category_id") REFERENCES "symptom_categories"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "symptom_entries" (
        "user_id" uuid NOT NULL,
        "log_date" date NOT NULL,
        "symptom_id" character varying(64) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_symptom_entries" PRIMARY KEY ("user_id", "log_date", "symptom_id"),
        CONSTRAINT "FK_symptom_entries_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_symptom_entries_symptom"
          FOREIGN KEY ("symptom_id") REFERENCES "symptoms"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      INSERT INTO "symptom_categories" ("id", "sort_order") VALUES
        ('vasomotor', 1),
        ('mood', 2),
        ('sleep_energy', 3),
        ('body_pain', 4),
        ('cycle', 5),
        ('urogenital', 6),
        ('digestion', 7),
        ('skin', 8)
    `);

    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order") VALUES
        ('hot_flashes', 'vasomotor', 1),
        ('night_sweats', 'vasomotor', 2),
        ('sweating', 'vasomotor', 3),
        ('calm', 'mood', 1),
        ('irritable', 'mood', 2),
        ('anxious', 'mood', 3),
        ('low_mood', 'mood', 4),
        ('mood_swings', 'mood', 5),
        ('brain_fog', 'mood', 6),
        ('insomnia', 'sleep_energy', 1),
        ('fatigue', 'sleep_energy', 2),
        ('sleepy', 'sleep_energy', 3),
        ('headache', 'body_pain', 1),
        ('joint_muscle_pain', 'body_pain', 2),
        ('backache', 'body_pain', 3),
        ('palpitations', 'body_pain', 4),
        ('breast_tenderness', 'body_pain', 5),
        ('flow_light', 'cycle', 1),
        ('flow_medium', 'cycle', 2),
        ('flow_heavy', 'cycle', 3),
        ('blood_clots', 'cycle', 4),
        ('spotting', 'cycle', 5),
        ('cramps', 'cycle', 6),
        ('vaginal_dryness', 'urogenital', 1),
        ('vaginal_itching', 'urogenital', 2),
        ('bladder_urgency', 'urogenital', 3),
        ('low_libido', 'urogenital', 4),
        ('unusual_discharge', 'urogenital', 5),
        ('nausea', 'digestion', 1),
        ('bloating', 'digestion', 2),
        ('constipation', 'digestion', 3),
        ('diarrhea', 'digestion', 4),
        ('cravings', 'digestion', 5),
        ('acne', 'skin', 1),
        ('dry_skin', 'skin', 2),
        ('itchy_skin', 'skin', 3)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "symptom_entries"`);
    await queryRunner.query(`DROP TABLE "symptoms"`);
    await queryRunner.query(`DROP TABLE "symptom_categories"`);
    await queryRunner.query(`DROP TABLE "mood_entry_feelings"`);
    await queryRunner.query(`DROP TABLE "mood_entries"`);
    await queryRunner.query(`DROP TABLE "period_days"`);
  }
}
