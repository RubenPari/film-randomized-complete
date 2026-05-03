import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity.js';
import { WatchlistItem } from '../entities/watchlist-item.entity.js';
import { DiscoveredItem } from '../entities/discovered-item.entity.js';
import { getTypeOrmConnectionOptions } from './typeorm-env.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...getTypeOrmConnectionOptions(process.env),
        entities: [User, WatchlistItem, DiscoveredItem],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
      }),
    }),
  ],
})
export class DatabaseModule {}
