import {
  BadRequestException,
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
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { TmdbMediaPayloadDto } from '../common/dto/tmdb-media-payload.dto.js';
import { DiscoveredService } from './discovered.service.js';

const MEDIA_TYPES = ['movie', 'tv'] as const;
type MediaTypeParam = (typeof MEDIA_TYPES)[number];

function parseMediaType(value: string): MediaTypeParam {
  if (!MEDIA_TYPES.includes(value as MediaTypeParam)) {
    throw new BadRequestException('mediaType must be movie or tv');
  }
  return value as MediaTypeParam;
}

@Controller('discovered')
@UseGuards(AuthGuard('jwt'))
export class DiscoveredController {
  constructor(private readonly discoveredService: DiscoveredService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async record(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: TmdbMediaPayloadDto,
  ) {
    return this.discoveredService.record(user.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.discoveredService.findAll(user.id);
  }

  @Delete(':mediaType/:tmdbId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('mediaType') mediaType: string,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const mt = parseMediaType(mediaType);
    await this.discoveredService.remove(mt, tmdbId, user.id);
    return { message: 'Item removed from discovered list' };
  }
}
