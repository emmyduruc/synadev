/* eslint-disable no-restricted-syntax -- TypeORM migrations must be classes */
import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Chat tools query each table by authenticated user_id (+ log_date).
 * Period days already use PK (user_id, log_date). Mood already has
 * UNIQUE (user_id, log_date). Health daily and assessments already have
 * covering indexes. This adds an explicit (user_id, log_date) index on
 * symptom_entries so date-range style listings stay efficient without
 * needing the full primary key including symptom_id.
 */
export class AddChatQueryIndexes1753438000000 implements MigrationInterface {
  name = 'AddChatQueryIndexes1753438000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_symptom_entries_user_log_date"
        ON "symptom_entries" ("user_id", "log_date")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_symptom_entries_user_log_date"`,
    );
  }
}
