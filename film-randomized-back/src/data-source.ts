import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { getTypeOrmConnectionOptions } from './database/typeorm-env.js';
import { User } from './entities/user.entity.js';
import { WatchlistItem } from './entities/watchlist-item.entity.js';
import { DiscoveredItem } from './entities/discovered-item.entity.js';

// TypeORM CLI entry point used by `npm run typeorm:generate` / `typeorm:run`.
// Loads .env from the backend dir or the monorepo root, in that order.
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config({ path: '../.env' });

export default new DataSource({
  ...getTypeOrmConnectionOptions(process.env),
  entities: [User, WatchlistItem, DiscoveredItem],
  migrations: [
    join(__dirname, 'migrations', '*.ts'),
    join(__dirname, 'migrations', '*.js'),
  ],
  synchronize: false,
});
