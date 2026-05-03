import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Promotes the `mediaType` column on `watchlist_items` and `discovered_items`
 * from a free-form `varchar` to a Postgres ENUM (`media_type_enum`).
 *
 * Why: until now nothing prevented the database from storing arbitrary strings
 * in `mediaType`. The application only ever writes `'movie'` or `'tv'`, so the
 * cast is non-destructive — but the new enum guarantees this at the schema
 * level and matches the `MediaType` TypeScript enum used by the entities.
 *
 * The conversion uses an explicit `USING text::media_type_enum` cast and
 * Postgres rebuilds the existing indexes automatically.
 */
export class MediaTypeEnum1775692800000 implements MigrationInterface {
  name = 'MediaTypeEnum1775692800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type_enum') THEN
          CREATE TYPE "media_type_enum" AS ENUM ('movie', 'tv');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "watchlist_items"
      ALTER COLUMN "mediaType" TYPE "media_type_enum"
      USING "mediaType"::text::"media_type_enum"
    `);

    await queryRunner.query(`
      ALTER TABLE "discovered_items"
      ALTER COLUMN "mediaType" TYPE "media_type_enum"
      USING "mediaType"::text::"media_type_enum"
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "discovered_items"
      ALTER COLUMN "mediaType" TYPE character varying
      USING "mediaType"::text
    `);

    await queryRunner.query(`
      ALTER TABLE "watchlist_items"
      ALTER COLUMN "mediaType" TYPE character varying
      USING "mediaType"::text
    `);

    await queryRunner.query(`DROP TYPE IF EXISTS "media_type_enum"`);
  }
}
