import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Removes the email-based password reset flow: drops the reset token columns
 * and their partial index from `users`.
 */
export class DropPasswordReset1778198400000 implements MigrationInterface {
  name = 'DropPasswordReset1778198400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_reset_token"`);
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "resetToken",
      DROP COLUMN IF EXISTS "resetTokenExpiry"
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "resetToken" character varying DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP WITH TIME ZONE DEFAULT NULL
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_reset_token"
        ON "users" ("resetToken")
        WHERE "resetToken" IS NOT NULL
    `);
  }
}
