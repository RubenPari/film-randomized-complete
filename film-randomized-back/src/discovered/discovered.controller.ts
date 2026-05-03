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
import {
  MEDIA_TYPE_VALUES,
  MediaType,
} from '../common/enums/media-type.enum.js';
import { DiscoveredService } from './discovered.service.js';

function parseMediaType(value: string): MediaType {
  if (!MEDIA_TYPE_VALUES.includes(value as MediaType)) {
    throw new BadRequestException('mediaType must be movie or tv');
  }
  return value as MediaType;
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
    await this.discoveredService.remove(
      parseMediaType(mediaType),
      tmdbId,
      user.id,
    );
    return { message: 'Item removed from discovered list' };
  }
}
