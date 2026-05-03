import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { WatchlistItem } from './watchlist-item.entity.js';
import { DiscoveredItem } from './discovered-item.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  // Defense in depth: the class-serializer interceptor strips these so even a
  // raw entity accidentally returned from a controller is safe over the wire.
  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true, default: null })
  resetToken: string | null;

  @Exclude()
  @Column({ type: 'timestamptz', nullable: true, default: null })
  resetTokenExpiry: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => WatchlistItem, (item) => item.user)
  watchlistItems: WatchlistItem[];

  @OneToMany(() => DiscoveredItem, (item) => item.user)
  discoveredItems: DiscoveredItem[];
}
