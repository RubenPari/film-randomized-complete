import * as Joi from 'joi';

/**
 * Joi schema that validates environment variables at application startup.
 * Only JWT_SECRET is required; everything else has a local-development default or is optional.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(8000),

  // Postgres connection URL; defaults to local Postgres (see database/typeorm-env.ts)
  DATABASE_URL: Joi.string().optional().allow(''),

  // Auth — JWT_SECRET must be at least 32 characters (256-bit hex or strong string).
  JWT_SECRET: Joi.string().min(32).required(),

  // AI Gateway (optional — feature stays disabled if not set)
  AI_GATEWAY_URL: Joi.string().uri().optional().allow(''),
  AI_GATEWAY_KEY: Joi.string().optional().allow(''),
});
