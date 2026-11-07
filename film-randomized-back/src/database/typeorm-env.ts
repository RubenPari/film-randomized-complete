type EnvLike = Record<string, string | undefined>;

const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/film_randomized';

/**
 * Builds the TypeORM Postgres connection from DATABASE_URL (local Postgres by default).
 * SSL or a Unix socket (Cloud SQL: `?host=/cloudsql/<instance>`) are set in the URL itself.
 */
export function getTypeOrmConnectionOptions(env: EnvLike): {
  type: 'postgres';
  url: string;
} {
  return {
    type: 'postgres',
    url: env.DATABASE_URL?.trim() || DEFAULT_DATABASE_URL,
  };
}
