import { MigrationInterface, QueryRunner } from 'typeorm';

export class DiscoveredItems1740000000000 implements MigrationInterface {
  name = 'DiscoveredItems1740000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "discovered_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tmdbId" integer NOT NULL,
        "mediaType" character varying NOT NULL,
        "title" character varying NOT NULL,
        "originalTitle" character varying DEFAULT NULL,
        "overview" text DEFAULT NULL,
        "posterPath" character varying DEFAULT NULL,
        "backdropPath" character varying DEFAULT NULL,
        "voteAverage" double precision DEFAULT NULL,
        "voteCount" integer DEFAULT NULL,
        "releaseDate" character varying DEFAULT NULL,
        "genres" text DEFAULT NULL,
        "runtime" integer DEFAULT NULL,
        "numberOfSeasons" integer DEFAULT NULL,
        "numberOfEpisodes" integer DEFAULT NULL,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_discovered_items_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_discovered_user_tmdb_media"
        ON "discovered_items" ("userId", "tmdbId", "mediaType")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_discovered_user" ON "discovered_items" ("userId")
    `);

    await queryRunner.query(`
      ALTER TABLE "discovered_items"
      ADD CONSTRAINT "FK_discovered_items_user"
      FOREIGN KEY ("userId") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discovered_items" DROP CONSTRAINT "FK_discovered_items_user"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_discovered_user"`);
    await queryRunner.query(`DROP INDEX "IDX_discovered_user_tmdb_media"`);
    await queryRunner.query(`DROP TABLE "discovered_items"`);
  }
}
