import { NotFoundException } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { BaseMediaItem } from '../../entities/base-media-item.entity.js';
import { TmdbMediaPayloadDto } from '../dto/tmdb-media-payload.dto.js';
import {
  MediaItemConstructor,
  buildMediaItemFromTmdbPayload,
} from '../mappers/tmdb-media.mapper.js';

/**
 * Shared CRUD primitives for any per-user media-collection feature
 * (`watchlist`, `discovered`, future bookmarks…).
 *
 * Concrete services extend this class and only need to:
 *   - call `super(repository, EntityClass, notFoundMessage)`;
 *   - decide their own conflict semantics in `create()` (throw vs. idempotent),
 *     possibly using `findOneFor()` as a building block.
 *
 * Kept intentionally thin: only the operations that are *literally* identical
 * across watchlist and discovered live here. Anything subtler (e.g. the
 * "throw on duplicate" vs "return existing" decision) stays in the subclass.
 */
export abstract class MediaCollectionService<T extends BaseMediaItem> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityCtor: MediaItemConstructor<T>,
    protected readonly notFoundMessage: string,
  ) {}

  /**
   * Returns every row owned by `userId`, newest first.
   */
  async findAll(userId: string): Promise<T[]> {
    return this.repository.find({
      where: { userId } as FindOptionsWhere<T>,
      order: { createdAt: 'DESC' } as FindOptionsOrder<T>,
    });
  }

  /**
   * Single-row lookup helper. Used by subclasses to implement their own
   * conflict-detection / idempotency rules.
   */
  protected findOneFor(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  /**
   * Maps the DTO to a fresh entity via {@link buildMediaItemFromTmdbPayload}
   * and persists it. Centralised so the mapping has exactly one home.
   */
  protected saveFromDto(userId: string, dto: TmdbMediaPayloadDto): Promise<T> {
    const item = buildMediaItemFromTmdbPayload(this.entityCtor, userId, dto);
    return this.repository.save(item);
  }

  /**
   * Deletes rows matching `where` in a single statement and throws
   * `NotFoundException` if nothing was deleted. Replaces the historical
   * `findOne + repository.remove()` pattern (2 round-trips → 1).
   */
  protected async deleteWhere(where: FindOptionsWhere<T>): Promise<void> {
    const result = await this.repository.delete(where);
    if (!result.affected) {
      throw new NotFoundException(this.notFoundMessage);
    }
  }
}
