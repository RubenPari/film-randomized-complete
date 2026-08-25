import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecommendationService } from './recommendation.service.js';
import { ExplainRecommendationDto } from './dto/explain.dto.js';

@Controller('api/recommend')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('explain')
  @UseGuards(AuthGuard('jwt'))
  async explain(@Request() req: { user: { id: string } }, @Body() dto: ExplainRecommendationDto) {
    return this.recommendationService.explain(dto);
  }
}
