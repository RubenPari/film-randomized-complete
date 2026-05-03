import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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
    } as FindOptionsWhere<WatchlistItem>);

    if (existing) {
      throw new ConflictException('Item already in watchlist');
    }

    return this.saveFromDto(userId, dto);
  }

  async findOneByTmdbId(
    tmdbId: number,
    userId: string,
  ): Promise<WatchlistItem> {
    const item = await this.findOneFor({
      tmdbId,
      userId,
    } as FindOptionsWhere<WatchlistItem>);

    if (!item) {
      throw new NotFoundException(NOT_FOUND_MESSAGE);
    }

    return item;
  }

  async remove(tmdbId: number, userId: string): Promise<void> {
    await this.deleteWhere({
      tmdbId,
      userId,
    } as FindOptionsWhere<WatchlistItem>);
  }
}
