import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity.js';
import { WatchlistItem } from '../entities/watchlist-item.entity.js';
import { DiscoveredItem } from '../entities/discovered-item.entity.js';
import { getTypeOrmConnectionOptions } from './typeorm-env.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...getTypeOrmConnectionOptions(process.env),
        entities: [User, WatchlistItem, DiscoveredItem],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
