import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MediaType } from '../common/enums/media-type.enum.js';

/**
 * Classe base per qualsiasi entità di raccolta media per utente (watchlist, discovered, …).
 *
 * Contiene tutte le colonne condivise da `WatchlistItem` e `DiscoveredItem`. Le
 * sottoclassi concrete devono solo fornire il loro decoratore `@Entity`, i loro indici e
 * il riferimento inverso `@ManyToOne` a `User`.
 *
 * NON è decorato con `@Entity` di proposito — TypeORM lo tratta come una superclasse mappata
 * e ne inserisce le colonne in ogni tabella sottoclasse.
 */
export abstract class BaseMediaItem {
  /**
   * ID dell'item
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * ID di TMDB
   */
  @Column()
  tmdbId: number;

  /**
   * Tipo di media
   */
  @Column({
    type: 'enum',
    enum: MediaType,
    enumName: 'media_type_enum',
  })
  mediaType: MediaType;

  /**
   * Titolo
   */
  @Column()
  title: string;

  /**
   * Titolo originale
   */
  @Column({ type: 'varchar', nullable: true, default: null })
  originalTitle: string | null;

  /**
   * Panoramica
   */
  @Column({ type: 'text', nullable: true, default: null })
  overview: string | null;

  /**
   * Percorso del poster
   */
  @Column({ type: 'varchar', nullable: true, default: null })
  posterPath: string | null;

  /**
   * Percorso del backdrop
   */
  @Column({ type: 'varchar', nullable: true, default: null })
  backdropPath: string | null;

  /**
   * Punteggio medio di voto
   */
  @Column({ type: 'float', nullable: true, default: null })
  voteAverage: number | null;

  /**
   * Numero di voti
   */
  @Column({ type: 'int', nullable: true, default: null })
  voteCount: number | null;

  /**
   * Data di rilascio
   */
  @Column({ type: 'varchar', nullable: true, default: null })
  releaseDate: string | null;

  /**
   * Generi
   * Memorizzati come JSON-encoded text so that the existing on-disk format
   * (`'[{"id":28,"name":"Action"}]'`) keeps working unchanged. Migrating to a
   * structured `simple-json` column is tracked for a later phase.
   */
  @Column({ type: 'text', nullable: true, default: null })
  genres: string | null;

  /**
   * Durata in minuti
   */
  @Column({ type: 'int', nullable: true, default: null })
  runtime: number | null;

  /**
   * Numero di stagioni
   */
  @Column({ type: 'int', nullable: true, default: null })
  numberOfSeasons: number | null;

  /**
   * Numero di episodi
   */
  @Column({ type: 'int', nullable: true, default: null })
  numberOfEpisodes: number | null;

  /**
   * ID dell'utente
   */
  @Column()
  userId: string;

  /**
   * Data di creazione
   */
  @CreateDateColumn()
  createdAt: Date;
}
