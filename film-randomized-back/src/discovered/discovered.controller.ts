import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { MessageResponseDto } from '../auth/dto/responses/message.response.dto.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { TmdbMediaPayloadDto } from '../common/dto/tmdb-media-payload.dto.js';
import { MediaItemResponseDto } from '../common/dto/responses/media-item.response.dto.js';
import { MediaType } from '../common/enums/media-type.enum.js';
import {
  toMediaItemResponse,
  toMediaItemResponseList,
} from '../common/mappers/media-item-response.mapper.js';
import { MediaTypeParamPipe } from '../common/pipes/media-type-param.pipe.js';
import { DiscoveredService } from './discovered.service.js';

@Controller('discovered')
@UseGuards(AuthGuard('jwt'))
export class DiscoveredController {
  constructor(private readonly discoveredService: DiscoveredService) { }

  /**
   * Registra un film scoperto
   * @param user Utente autenticato
   * @param dto Dati del film
   * @returns Film registrato
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async record(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: TmdbMediaPayloadDto,
  ): Promise<MediaItemResponseDto> {
    const item = await this.discoveredService.record(user.id, dto);
    return toMediaItemResponse(item);
  }

  /**
   * Restituisce la lista dei film scoperti
   * @param user Utente autenticato
   * @returns Lista dei film scoperti
   */
  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MediaItemResponseDto[]> {
    const items = await this.discoveredService.findAll(user.id);
    return toMediaItemResponseList(items);
  }

  /**
   * Rimuove un film scoperto
   * @param mediaType Tipo di media
   * @param tmdbId ID del film
   * @param user Utente autenticato
   * @returns Messaggio di conferma
   */
  @Delete(':mediaType/:tmdbId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('mediaType', MediaTypeParamPipe) mediaType: MediaType,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MessageResponseDto> {
    await this.discoveredService.remove(mediaType, tmdbId, user.id);
    return { message: 'Item removed from discovered list' };
  }
}
