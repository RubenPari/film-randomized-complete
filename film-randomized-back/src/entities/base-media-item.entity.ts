import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MediaType } from '../common/enums/media-type.enum.js';

/**
 * Base class for any per-user media-collection entity (watchlist, discovered, …).
 *
 * Holds every column shared by `WatchlistItem` and `DiscoveredItem`. Concrete
 * subclasses only need to provide their `@Entity` decorator, their indexes and
 * the `@ManyToOne` back-reference to `User`.
 *
 * NOT decorated with `@Entity` on purpose — TypeORM treats this as a mapped
 * superclass and inlines its columns into each subclass table.
 */
export abstract class BaseMediaItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tmdbId: number;

  @Column({
    type: 'enum',
    enum: MediaType,
    enumName: 'media_type_enum',
  })
  mediaType: MediaType;

  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  originalTitle: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  overview: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  posterPath: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  backdropPath: string | null;

  @Column({ type: 'float', nullable: true, default: null })
  voteAverage: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  voteCount: number | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  releaseDate: string | null;

  // Stored as JSON-encoded text so that the existing on-disk format
  // (`'[{"id":28,"name":"Action"}]'`) keeps working unchanged. Migrating to a
  // structured `simple-json` column is tracked for a later phase.
  @Column({ type: 'text', nullable: true, default: null })
  genres: string | null;

  @Column({ type: 'int', nullable: true, default: null })
  runtime: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  numberOfSeasons: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  numberOfEpisodes: number | null;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
