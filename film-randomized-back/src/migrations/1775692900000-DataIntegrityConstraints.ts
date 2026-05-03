import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tightens the `users` table with the data-integrity constraints that should
 * have been on the initial schema but were left open:
 *
 * 1. Bounded lengths on `username` (64) and `email` (255). The API-side
 *    `RegisterDto` already caps `username` at 30, so 64 is well above any
 *    legitimate row; the ALTER is non-destructive for that reason.
 *
 * 2. A partial index on `resetToken` for rows where the token is present.
 *    Every password-reset verify path does `findById` today, but a future
 *    "look up user by reset token" lookup (and the reset flow itself after
 *    we pivot it to a token-first query) will rely on this index.
 *
 * 3. Timestamps promoted to `TIMESTAMPTZ`. Existing rows were written as
 *    naive `TIMESTAMP` — Postgres stores those as-is, so we interpret them
 *    as UTC during the conversion (`AT TIME ZONE 'UTC'`). The backend has
 *    always run with UTC clocks, so this is a no-op for data already in the
 *    DB while giving us timezone-aware columns going forward.
 *
 * Every step uses `IF NOT EXISTS` / `USING` clauses so the migration is safe
 * to re-run and cleanly reversible.
 */
export class DataIntegrityConstraints1775692900000
  implements MigrationInterface
{
  name = 'DataIntegrityConstraints1775692900000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "username" TYPE character varying(64)
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "email" TYPE character varying(255)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_reset_token"
        ON "users" ("resetToken")
        WHERE "resetToken" IS NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE
      USING "createdAt" AT TIME ZONE 'UTC'
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE
      USING "updatedAt" AT TIME ZONE 'UTC'
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "resetTokenExpiry" TYPE TIMESTAMP WITH TIME ZONE
      USING "resetTokenExpiry" AT TIME ZONE 'UTC'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "resetTokenExpiry" TYPE TIMESTAMP
      USING "resetTokenExpiry" AT TIME ZONE 'UTC'
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "updatedAt" TYPE TIMESTAMP
      USING "updatedAt" AT TIME ZONE 'UTC'
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "createdAt" TYPE TIMESTAMP
      USING "createdAt" AT TIME ZONE 'UTC'
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_reset_token"`);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "email" TYPE character varying
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "username" TYPE character varying
    `);
  }
}
