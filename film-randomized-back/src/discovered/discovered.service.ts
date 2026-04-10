import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscoveredItem } from '../entities/discovered-item.entity.js';
import { TmdbMediaPayloadDto } from '../common/dto/tmdb-media-payload.dto.js';

@Injectable()
export class DiscoveredService {
  constructor(
    @InjectRepository(DiscoveredItem)
    private readonly discoveredRepository: Repository<DiscoveredItem>,
  ) {}

  /**
   * Records a discovered title. Idempotent: returns existing row if already present.
   */
  async record(
    userId: string,
    dto: TmdbMediaPayloadDto,
  ): Promise<DiscoveredItem> {
    const existing = await this.discoveredRepository.findOne({
      where: {
        userId,
        tmdbId: dto.tmdb_id,
        mediaType: dto.media_type,
      },
    });

    if (existing) {
      return existing;
    }

    const item = new DiscoveredItem();
    item.tmdbId = dto.tmdb_id;
    item.mediaType = dto.media_type;
    item.title = dto.title;
    item.originalTitle = dto.original_title ?? null;
    item.overview = dto.overview ?? null;
    item.posterPath = dto.poster_path ?? null;
    item.backdropPath = dto.backdrop_path ?? null;
    item.voteAverage = dto.vote_average ?? null;
    item.voteCount = dto.vote_count ?? null;
    item.releaseDate = dto.release_date ?? null;
    item.genres = dto.genres ?? null;
    item.runtime = dto.runtime ?? null;
    item.numberOfSeasons = dto.number_of_seasons ?? null;
    item.numberOfEpisodes = dto.number_of_episodes ?? null;
    item.userId = userId;

    return this.discoveredRepository.save(item);
  }

  async findAll(userId: string): Promise<DiscoveredItem[]> {
    return this.discoveredRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(
    mediaType: string,
    tmdbId: number,
    userId: string,
  ): Promise<void> {
    const item = await this.discoveredRepository.findOne({
      where: { mediaType, tmdbId, userId },
    });

    if (!item) {
      throw new NotFoundException('Item not found in discovered list');
    }

    await this.discoveredRepository.remove(item);
  }
}
