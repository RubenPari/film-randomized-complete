import { plainToInstance } from 'class-transformer';
import { BaseMediaItem } from '../../entities/base-media-item.entity.js';
import { MediaItemResponseDto } from '../dto/responses/media-item.response.dto.js';

/**
 * Converte una BaseMediaItem in MediaItemResponseDto
 * @param item Oggetto BaseMediaItem da convertire
 * @returns Oggetto MediaItemResponseDto convertito
 */
export function toMediaItemResponse(item: BaseMediaItem): MediaItemResponseDto {
  return plainToInstance(MediaItemResponseDto, item, {
    excludeExtraneousValues: true,
  });
}

/**
 * Converte una lista di BaseMediaItem in lista di MediaItemResponseDto
 * @param items Lista di oggetti BaseMediaItem da convertire
 * @returns Lista di oggetti MediaItemResponseDto convertiti
 */
export function toMediaItemResponseList(
  items: BaseMediaItem[],
): MediaItemResponseDto[] {
  return items.map(toMediaItemResponse);
}
