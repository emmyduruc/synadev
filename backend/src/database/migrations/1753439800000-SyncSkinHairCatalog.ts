/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Skin & Hair catalog: skin_and_hair, dry_skin, itchy_skin, hair_loss.
 */
export class SyncSkinHairCatalog1753439800000 implements MigrationInterface {
  name = 'SyncSkinHairCatalog1753439800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "symptoms" ("id", "category_id", "sort_order")
      VALUES ('hair_loss', 'skin', 4)
      ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'skin', "sort_order" = 1
      WHERE "id" = 'skin_and_hair'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'skin', "sort_order" = 2
      WHERE "id" = 'dry_skin'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'skin', "sort_order" = 3
      WHERE "id" = 'itchy_skin'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "category_id" = 'skin', "sort_order" = 4
      WHERE "id" = 'hair_loss'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 90
      WHERE "id" = 'acne'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 1
      WHERE "id" = 'acne'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 2
      WHERE "id" = 'dry_skin'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 3
      WHERE "id" = 'itchy_skin'
    `);

    await queryRunner.query(`
      UPDATE "symptoms"
      SET "sort_order" = 45
      WHERE "id" = 'skin_and_hair'
    `);

    await queryRunner.query(`
      DELETE FROM "symptom_entries" WHERE "symptom_id" = 'hair_loss'
    `);

    await queryRunner.query(`
      DELETE FROM "symptoms" WHERE "id" = 'hair_loss'
    `);
  }
}
