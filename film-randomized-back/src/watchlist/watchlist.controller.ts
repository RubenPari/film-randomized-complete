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
import {
  toMediaItemResponse,
  toMediaItemResponseList,
} from '../common/mappers/media-item-response.mapper.js';
import { WatchlistService } from './watchlist.service.js';

@Controller('watchlist')
@UseGuards(AuthGuard('jwt'))
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: TmdbMediaPayloadDto,
  ): Promise<MediaItemResponseDto> {
    const item = await this.watchlistService.create(user.id, dto);
    return toMediaItemResponse(item);
  }

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MediaItemResponseDto[]> {
    const items = await this.watchlistService.findAll(user.id);
    return toMediaItemResponseList(items);
  }

  @Get(':tmdbId')
  async findOne(
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MediaItemResponseDto> {
    const item = await this.watchlistService.findOneByTmdbId(tmdbId, user.id);
    return toMediaItemResponse(item);
  }

  @Delete(':tmdbId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MessageResponseDto> {
    await this.watchlistService.remove(tmdbId, user.id);
    return { message: 'Item removed from watchlist' };
  }
}
