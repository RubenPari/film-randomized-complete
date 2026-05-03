import type { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions.js';

type EnvLike = Record<string, string | undefined>;

/**
 * Builds Postgres connection fields for TypeORM from process-style env.
 * Prefer DATABASE_URL (e.g. Fly `postgres attach`); otherwise use discrete DB_* vars.
 */
export function getTypeOrmConnectionOptions(
  env: EnvLike,
): { type: 'postgres' } & PostgresConnectionCredentialsOptions {
  const sslEnabled = env.DB_SSL === 'true';
  const rejectUnauthorized = env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';
  const ssl: PostgresConnectionCredentialsOptions['ssl'] = sslEnabled
    ? { rejectUnauthorized }
    : false;

  const databaseUrl = env.DATABASE_URL?.trim();
  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl,
    };
  }

  return {
    type: 'postgres',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 5432),
    username: env.DB_USERNAME ?? 'postgres',
    password: env.DB_PASSWORD ?? 'postgres',
    database: env.DB_DATABASE ?? 'film_randomized',
    ssl,
  };
}
