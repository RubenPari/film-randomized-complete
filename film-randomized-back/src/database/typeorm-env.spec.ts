import { getTypeOrmConnectionOptions } from './typeorm-env.js';

describe('getTypeOrmConnectionOptions', () => {
  it('uses the managed database URL with verified TLS and its CA certificate', () => {
    const options = getTypeOrmConnectionOptions({
      DATABASE_URL:
        'postgresql://film_app:password@db.internal:25060/film_randomized?sslmode=require',
      DB_SSL: 'true',
      DB_SSL_CA:
        '-----BEGIN CERTIFICATE-----\\ncertificate\\n-----END CERTIFICATE-----',
    });

    expect(options).toMatchObject({
      type: 'postgres',
      url: 'postgresql://film_app:password@db.internal:25060/film_randomized',
      ssl: {
        rejectUnauthorized: true,
        ca: '-----BEGIN CERTIFICATE-----\ncertificate\n-----END CERTIFICATE-----',
      },
    });
  });

  it('keeps local connections unencrypted by default', () => {
    const options = getTypeOrmConnectionOptions({
      DB_HOST: 'localhost',
      DB_USERNAME: 'postgres',
      DB_PASSWORD: 'postgres',
      DB_DATABASE: 'film_randomized',
    });

    expect(options.ssl).toBe(false);
  });
});
