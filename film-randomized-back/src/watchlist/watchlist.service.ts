import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchlistItem } from '../entities/watchlist-item.entity.js';
import { TmdbMediaPayloadDto } from '../common/dto/tmdb-media-payload.dto.js';
import { MediaCollectionService } from '../common/services/media-collection.service.js';

const NOT_FOUND_MESSAGE = 'Item not found in watchlist';

@Injectable()
export class WatchlistService extends MediaCollectionService<WatchlistItem> {
  constructor(
    @InjectRepository(WatchlistItem)
    repository: Repository<WatchlistItem>,
  ) {
    super(repository, WatchlistItem, NOT_FOUND_MESSAGE);
  }

  /**
   * Crea un item nella watchlist
   * @param userId ID dell'utente
   * @param dto Dati dell'item
   * @returns Item creato
   */
  async create(
    userId: string,
    dto: TmdbMediaPayloadDto,
  ): Promise<WatchlistItem> {
    // Historical behaviour: a (userId, tmdbId) pair is considered a duplicate
    // even if the existing row has a different mediaType. The DB-level unique
    // index on (userId, tmdbId, mediaType) is stricter, so this check is the
    // user-visible contract — keep it.
    const existing = await this.findOneFor({
      tmdbId: dto.tmdb_id,
      userId,
    });

    if (existing) {
      throw new ConflictException('Item already in watchlist');
    }

    return this.saveFromDto(userId, dto);
  }

  /**
   * Trova un item nella watchlist by tmdbId
   * @param tmdbId ID del film
   * @param userId ID dell'utente
   * @returns Item trovato
   */
  async findOneByTmdbId(
    tmdbId: number,
    userId: string,
  ): Promise<WatchlistItem> {
    return this.findOneOrThrow({
      tmdbId,
      userId,
    });
  }

  /**
   * Rimuove un item dalla watchlist
   * @param tmdbId ID del film
   * @param userId ID dell'utente
   */
  async remove(tmdbId: number, userId: string): Promise<void> {
    await this.deleteWhere({
      tmdbId,
      userId,
    });
  }
}
