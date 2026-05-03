import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import dataSource from '../data-source.js';
import { User } from '../entities/user.entity.js';
import { WatchlistItem } from '../entities/watchlist-item.entity.js';
import { DiscoveredItem } from '../entities/discovered-item.entity.js';
import { MediaType } from '../common/enums/media-type.enum.js';

/**
 * Idempotent seed script. Creates a single demo user plus a handful of
 * watchlist / discovered rows so the API has something to return on a fresh
 * database. Running the script twice is a no-op after the first time.
 *
 * Usage: `npm run seed`
 */

const DEMO_USER = {
  username: 'demo',
  email: 'demo@filmrandomized.local',
  password: 'demopassword',
};

const DEMO_WATCHLIST: Array<Omit<WatchlistItem, 'id' | 'createdAt' | 'user' | 'userId'>> = [
  {
    tmdbId: 603,
    mediaType: MediaType.MOVIE,
    title: 'The Matrix',
    originalTitle: 'The Matrix',
    overview:
      'Set in the 22nd century, a computer hacker learns from mysterious rebels about the true nature of his reality.',
    posterPath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdropPath: '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
    voteAverage: 8.2,
    voteCount: 25000,
    releaseDate: '1999-03-30',
    genres: JSON.stringify([
      { id: 28, name: 'Action' },
      { id: 878, name: 'Science Fiction' },
    ]),
    runtime: 136,
    numberOfSeasons: null,
    numberOfEpisodes: null,
  },
  {
    tmdbId: 1396,
    mediaType: MediaType.TV,
    title: 'Breaking Bad',
    originalTitle: 'Breaking Bad',
    overview:
      'When Walter White, a chemistry teacher, is diagnosed with cancer, he turns to a life of crime.',
    posterPath: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdropPath: '/84XPpjGvxNyExjSuLQe0SzioErt.jpg',
    voteAverage: 8.9,
    voteCount: 15000,
    releaseDate: '2008-01-20',
    genres: JSON.stringify([{ id: 18, name: 'Drama' }]),
    runtime: null,
    numberOfSeasons: 5,
    numberOfEpisodes: 62,
  },
];

const DEMO_DISCOVERED: Array<Omit<DiscoveredItem, 'id' | 'createdAt' | 'user' | 'userId'>> = [
  {
    tmdbId: 155,
    mediaType: MediaType.MOVIE,
    title: 'The Dark Knight',
    originalTitle: 'The Dark Knight',
    overview:
      'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent.',
    posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    voteAverage: 8.5,
    voteCount: 30000,
    releaseDate: '2008-07-18',
    genres: JSON.stringify([
      { id: 28, name: 'Action' },
      { id: 80, name: 'Crime' },
    ]),
    runtime: 152,
    numberOfSeasons: null,
    numberOfEpisodes: null,
  },
];

async function seed(): Promise<void> {
  const ds = await dataSource.initialize();
  try {
    const userRepo = ds.getRepository(User);
    const watchlistRepo = ds.getRepository(WatchlistItem);
    const discoveredRepo = ds.getRepository(DiscoveredItem);

    let user = await userRepo.findOne({ where: { username: DEMO_USER.username } });
    if (user) {
      // eslint-disable-next-line no-console
      console.log(`[seed] user "${DEMO_USER.username}" already exists — skipping.`);
      return;
    }

    const password = await bcrypt.hash(DEMO_USER.password, 10);
    user = await userRepo.save(
      userRepo.create({
        username: DEMO_USER.username,
        email: DEMO_USER.email,
        password,
      }),
    );
    // eslint-disable-next-line no-console
    console.log(`[seed] created user ${user.username} (${user.email})`);

    for (const row of DEMO_WATCHLIST) {
      await watchlistRepo.save(watchlistRepo.create({ ...row, userId: user.id }));
    }
    for (const row of DEMO_DISCOVERED) {
      await discoveredRepo.save(discoveredRepo.create({ ...row, userId: user.id }));
    }

    // eslint-disable-next-line no-console
    console.log(
      `[seed] inserted ${DEMO_WATCHLIST.length} watchlist + ${DEMO_DISCOVERED.length} discovered rows.`,
    );
    // eslint-disable-next-line no-console
    console.log(
      `[seed] demo credentials — username: ${DEMO_USER.username}  password: ${DEMO_USER.password}`,
    );
  } finally {
    await ds.destroy();
  }
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] failed:', err);
  process.exit(1);
});
