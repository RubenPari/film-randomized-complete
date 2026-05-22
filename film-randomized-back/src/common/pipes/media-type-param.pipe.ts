import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MEDIA_TYPE_VALUES, MediaType } from '../enums/media-type.enum.js';

/**
 * Pipe per la validazione del parametro mediaType
 */
@Injectable()
export class MediaTypeParamPipe implements PipeTransform<string, MediaType> {
  transform(value: string): MediaType {
    if (!MEDIA_TYPE_VALUES.includes(value as MediaType)) {
      throw new BadRequestException('mediaType must be movie or tv');
    }
    return value as MediaType;
  }
}
