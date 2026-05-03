import { Entity, Index, ManyToOne } from 'typeorm';
import { BaseMediaItem } from './base-media-item.entity.js';
import { User } from './user.entity.js';

@Entity('watchlist_items')
@Index('IDX_watchlist_user_tmdb_media', ['userId', 'tmdbId', 'mediaType'], {
  unique: true,
})
@Index('IDX_watchlist_user', ['userId'])
export class WatchlistItem extends BaseMediaItem {
  @ManyToOne(() => User, (user) => user.watchlistItems, { onDelete: 'CASCADE' })
  user: User;
}
