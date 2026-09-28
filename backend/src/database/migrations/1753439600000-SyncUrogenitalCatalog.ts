/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Urogenital catalog: dryness, libido, bladder urgency, pain on urination.
 */
export class SyncUrogenitalCatalog1753439600000 implements MigrationInterface {
  name = 'SyncUrogenitalCatalog1753439600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order")
      VALUES ('pain_on_urination', 'urogenital', 4)
      ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'urogenital', "sort_order" = 1
      WHERE "id" = 'dryness'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'urogenital', "sort_order" = 2
      WHERE "id" = 'low_libido'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'urogenital', "sort_order" = 3
      WHERE "id" = 'bladder_urgency'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'urogenital', "sort_order" = 4
      WHERE "id" = 'pain_on_urination'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 90
      WHERE "id" IN (
        'vaginal_dryness',
        'vaginal_itching',
        'unusual_discharge'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 1
      WHERE "id" = 'vaginal_dryness'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 2
      WHERE "id" = 'vaginal_itching'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 3
      WHERE "id" = 'bladder_urgency'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 4
      WHERE "id" = 'low_libido'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 5
      WHERE "id" = 'unusual_discharge'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 36
      WHERE "id" = 'dryness'
    `);

    await queryRunner.query(`
      DELETE FROM "symptom_entries" WHERE "symptom_id" = 'pain_on_urination'
    `);

    await queryRunner.query(`
      DELETE FROM "symptoms" WHERE "id" = 'pain_on_urination'
    `);
  }
}
