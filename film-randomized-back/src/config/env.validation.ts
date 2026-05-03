import * as Joi from 'joi';

const nonEmptyDatabaseUrl = Joi.string().min(1);

/**
 * Joi schema that validates required environment variables at application startup.
 * The application fails to bootstrap if any required value is missing or invalid.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(8000),

  // Database — either DATABASE_URL (e.g. Fly Postgres attach) or discrete DB_* vars
  DATABASE_URL: Joi.string().optional().allow(''),
  DB_HOST: Joi.when('DATABASE_URL', {
    is: nonEmptyDatabaseUrl,
    then: Joi.string().optional(),
    otherwise: Joi.string().min(1).default('localhost'),
  }),
  DB_PORT: Joi.when('DATABASE_URL', {
    is: nonEmptyDatabaseUrl,
    then: Joi.number().integer().min(1).max(65535).optional(),
    otherwise: Joi.number().integer().min(1).max(65535).default(5432),
  }),
  DB_USERNAME: Joi.when('DATABASE_URL', {
    is: nonEmptyDatabaseUrl,
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DB_PASSWORD: Joi.when('DATABASE_URL', {
    is: nonEmptyDatabaseUrl,
    then: Joi.string().optional().allow(''),
    otherwise: Joi.string().required().allow(''),
  }),
  DB_DATABASE: Joi.when('DATABASE_URL', {
    is: nonEmptyDatabaseUrl,
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_SSL: Joi.boolean().default(false),
  DB_SSL_REJECT_UNAUTHORIZED: Joi.boolean().default(true),

  // Auth — JWT_SECRET must be at least 32 characters (256-bit hex or strong string).
  JWT_SECRET: Joi.string().min(32).required(),

  // Frontend / CORS
  FRONTEND_URL: Joi.string().uri().required(),

  // Email (optional — feature stays disabled if not set)
  MAILTRAP_TOKEN: Joi.string().optional().allow(''),
  MAILTRAP_SENDER_EMAIL: Joi.string().email().optional().allow(''),
});
