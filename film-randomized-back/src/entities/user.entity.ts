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

/**
 * Entità che rappresenta un utente
 */
@Entity('users')
export class User {
  /**
   * ID dell'utente
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Username
   */
  @Column({ type: 'varchar', length: 64, unique: true })
  username: string;

  /**
   * Email
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /**
   * Password
   */
  @Exclude()
  @Column()
  password: string;

  /**
   * Data di creazione
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * Data di aggiornamento
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /**
   * Lista dei film da vedere
   */
  @OneToMany(() => WatchlistItem, (item) => item.user)
  watchlistItems: WatchlistItem[];

  /**
   * Lista dei film scoperti
   */
  @OneToMany(() => DiscoveredItem, (item) => item.user)
  discoveredItems: DiscoveredItem[];
}
