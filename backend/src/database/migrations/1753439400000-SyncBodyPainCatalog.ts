/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Body & Pain catalog: split muscle pain, add dizziness/tingling,
 * move bloating + digestive_patterns under body_pain.
 */
export class SyncBodyPainCatalog1753439400000 implements MigrationInterface {
  name = 'SyncBodyPainCatalog1753439400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order") VALUES
        ('muscle_pain', 'body_pain', 3),
        ('dizziness', 'body_pain', 7),
        ('tingling', 'body_pain', 8)
      ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 1
      WHERE "id" = 'joint_muscle_pain'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 2
      WHERE "id" = 'joint_stiffness'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 3
      WHERE "id" = 'muscle_pain'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 4
      WHERE "id" = 'headache'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 5
      WHERE "id" = 'palpitations'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 6
      WHERE "id" = 'breast_tenderness'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 7
      WHERE "id" = 'dizziness'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 8
      WHERE "id" = 'tingling'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 9
      WHERE "id" = 'bloating'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 10
      WHERE "id" = 'digestive_patterns'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 90
      WHERE "id" = 'backache'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'digestion', "sort_order" = 2
      WHERE "id" = 'bloating'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'digestion', "sort_order" = 25
      WHERE "id" = 'digestive_patterns'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 1
      WHERE "id" = 'headache'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 2
      WHERE "id" = 'joint_muscle_pain'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 25
      WHERE "id" = 'joint_stiffness'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 3
      WHERE "id" = 'backache'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 4
      WHERE "id" = 'palpitations'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'body_pain', "sort_order" = 5
      WHERE "id" = 'breast_tenderness'
    `);

    await queryRunner.query(`
      DELETE FROM "symptom_entries"
      WHERE "symptom_id" IN ('muscle_pain', 'dizziness', 'tingling')
    `);

    await queryRunner.query(`
      DELETE FROM "symptoms"
      WHERE "id" IN ('muscle_pain', 'dizziness', 'tingling')
    `);
  }
}
