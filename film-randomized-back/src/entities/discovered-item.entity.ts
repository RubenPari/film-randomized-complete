import { Entity, Index, ManyToOne } from 'typeorm';
import { BaseMediaItem } from './base-media-item.entity.js';
import { User } from './user.entity.js';

@Entity('discovered_items')
@Index('IDX_discovered_user_tmdb_media', ['userId', 'tmdbId', 'mediaType'], {
  unique: true,
})
@Index('IDX_discovered_user', ['userId'])
export class DiscoveredItem extends BaseMediaItem {
  @ManyToOne(() => User, (user) => user.discoveredItems, {
    onDelete: 'CASCADE',
  })
  user: User;
}
