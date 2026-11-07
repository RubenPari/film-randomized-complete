import { parse } from 'pg-connection-string';
import { getTypeOrmConnectionOptions } from './typeorm-env.js';

describe('getTypeOrmConnectionOptions', () => {
  it('defaults to the local Postgres database', () => {
    expect(getTypeOrmConnectionOptions({}).url).toBe(
      'postgresql://postgres:postgres@localhost:5432/film_randomized',
    );
  });

  it('passes a Cloud SQL socket URL through so pg connects via the socket', () => {
    const url =
      'postgresql://film_app:secret@localhost/film_randomized?host=/cloudsql/proj:europe-west1:film-randomized-db';

    const options = getTypeOrmConnectionOptions({ DATABASE_URL: ` ${url} ` });

    expect(options.url).toBe(url);
    expect(parse(options.url)).toMatchObject({
      host: '/cloudsql/proj:europe-west1:film-randomized-db',
      user: 'film_app',
      database: 'film_randomized',
    });
  });
});
