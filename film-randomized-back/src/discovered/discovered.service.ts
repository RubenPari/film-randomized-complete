import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
   * Registra un film scoperto
   * @param userId ID dell'utente
   * @param dto Dati del film
   * @returns Film registrato
   */
  async record(
    userId: string,
    dto: TmdbMediaPayloadDto,
  ): Promise<DiscoveredItem> {
    const existing = await this.findOneFor({
      userId,
      tmdbId: dto.tmdb_id,
      mediaType: dto.media_type,
    });

    if (existing) {
      return existing;
    }

    return this.saveFromDto(userId, dto);
  }

  /**
   * Rimuove un film scoperto
   * @param mediaType Tipo di media
   * @param tmdbId ID del film
   * @param userId ID dell'utente
   */
  async remove(
    mediaType: MediaType,
    tmdbId: number,
    userId: string,
  ): Promise<void> {
    await this.deleteWhere({
      mediaType,
      tmdbId,
      userId,
    });
  }
}
