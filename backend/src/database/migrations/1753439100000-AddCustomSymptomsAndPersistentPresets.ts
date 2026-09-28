/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Custom symptoms (user-owned rows on symptoms), extra categories,
 * and persistent-complaint catalog seeds.
 */
export class AddCustomSymptomsAndPersistentPresets1753439100000
  implements MigrationInterface
{
  name = 'AddCustomSymptomsAndPersistentPresets1753439100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "symptom_categories" ("id", "sort_order") VALUES
        ('cognition', 9),
        ('miscellaneous', 10)
      ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      ALTER TABLE "symptoms"
        ADD COLUMN IF NOT EXISTS "user_id" uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "symptoms"
        ADD COLUMN IF NOT EXISTS "label" varchar(80)
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_symptoms_user_id'
        ) THEN
          ALTER TABLE "symptoms"
            ADD CONSTRAINT "FK_symptoms_user_id"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
        END IF;
      END $$
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_symptoms_user_id"
        ON "symptoms" ("user_id")
    `);

    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order") VALUES
        ('joint_stiffness', 'body_pain', 25),
        ('dryness', 'urogenital', 36),
        ('skin_and_hair', 'skin', 45),
        ('forgetfulness', 'cognition', 1),
        ('digestive_patterns', 'digestion', 25)
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "symptom_entries"
      WHERE "symptom_id" IN (
        'joint_stiffness', 'dryness', 'skin_and_hair', 'forgetfulness', 'digestive_patterns'
      )
      OR "symptom_id" LIKE 'custom_%'
    `);

    await queryRunner.query(`
      DELETE FROM "symptoms"
      WHERE "id" IN (
        'joint_stiffness', 'dryness', 'skin_and_hair', 'forgetfulness', 'digestive_patterns'
      )
      OR "user_id" IS NOT NULL
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_symptoms_user_id"`);

    await queryRunner.query(`
      ALTER TABLE "symptoms" DROP CONSTRAINT IF EXISTS "FK_symptoms_user_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "symptoms" DROP COLUMN IF EXISTS "label"
    `);

    await queryRunner.query(`
      ALTER TABLE "symptoms" DROP COLUMN IF EXISTS "user_id"
    `);

    await queryRunner.query(`
      DELETE FROM "symptom_categories"
      WHERE "id" IN ('cognition', 'miscellaneous')
    `);
  }
}
