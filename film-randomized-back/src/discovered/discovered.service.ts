import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DiscoveredItem } from '../entities/discovered-item.entity.js';
import { TmdbMediaPayloadDto } from '../common/dto/tmdb-media-payload.dto.js';
import { MediaCollectionService } from '../common/services/media-collection.service.js';
import { MediaType } from '../common/enums/media-type.enum.js';

@Injectable()
export class DiscoveredService extends MediaCollectionService<DiscoveredItem> {
  constructor(
    @InjectRepository(DiscoveredItem)
    repository: Repository<DiscoveredItem>,
  ) {
    super(repository, DiscoveredItem, 'Item not found in discovered list');
  }

  /**
   * Records a discovered title. Idempotent: returns the existing row when the
   * exact (userId, tmdbId, mediaType) tuple already exists.
   */
  async record(
    userId: string,
    dto: TmdbMediaPayloadDto,
  ): Promise<DiscoveredItem> {
    const existing = await this.findOneFor({
      userId,
      tmdbId: dto.tmdb_id,
      mediaType: dto.media_type as MediaType,
    } as FindOptionsWhere<DiscoveredItem>);

    if (existing) {
      return existing;
    }

    return this.saveFromDto(userId, dto);
  }

  async remove(
    mediaType: MediaType,
    tmdbId: number,
    userId: string,
  ): Promise<void> {
    await this.deleteWhere({
      mediaType,
      tmdbId,
      userId,
    } as FindOptionsWhere<DiscoveredItem>);
  }
}
