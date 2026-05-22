import { plainToInstance } from 'class-transformer';
import { BaseMediaItem } from '../../entities/base-media-item.entity.js';
import { MediaItemResponseDto } from '../dto/responses/media-item.response.dto.js';

export function toMediaItemResponse(item: BaseMediaItem): MediaItemResponseDto {
  return plainToInstance(MediaItemResponseDto, item, {
    excludeExtraneousValues: true,
  });
}

export function toMediaItemResponseList(
  items: BaseMediaItem[],
): MediaItemResponseDto[] {
  return items.map(toMediaItemResponse);
}
