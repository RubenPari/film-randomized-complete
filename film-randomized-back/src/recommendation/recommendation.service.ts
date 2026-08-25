import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { ExplainRecommendationDto } from './dto/explain.dto.js';

const explanationSchema = z.object({
  explanation: z.string(),
  matchScore: z.number().int().min(0).max(100),
});

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(private readonly configService: ConfigService) {}

  async explain(dto: ExplainRecommendationDto): Promise<{ explanation: string; matchScore: number }> {
    const gatewayUrl = this.configService.get<string>('AI_GATEWAY_URL');
    const gatewayKey = this.configService.get<string>('AI_GATEWAY_KEY');

    if (!gatewayUrl || !gatewayKey) {
      this.logger.warn('AI Gateway not configured, skipping AI explanation');
      return { explanation: '', matchScore: 0 };
    }

    try {
      const openai = createOpenAI({ apiKey: gatewayKey, baseURL: gatewayUrl });

      const systemPrompt = this.buildSystemPrompt(dto);

      const result = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: explanationSchema,
        system: systemPrompt,
        prompt: 'Generate the recommendation explanation.',
        temperature: 0.7,
        maxOutputTokens: 300,
      });

      return result.object;
    } catch (error) {
      this.logger.error('AI Gateway call failed', error instanceof Error ? error.message : error);
      return { explanation: '', matchScore: 0 };
    }
  }

  private buildSystemPrompt(dto: ExplainRecommendationDto): string {
    const { userProfile, candidate } = dto;
    const likedGenres = userProfile.likedGenres.map((g) => g.name).join(', ') || 'none';
    const dislikedGenres = userProfile.dislikedGenres.map((g) => g.name).join(', ') || 'none';
    const likedTitles = userProfile.likedMedia
      .slice(0, 5)
      .map((m) => `"${m.title}" (${m.genres.join(', ')})`)
      .join('; ') || 'none';
    const dislikedTitles = userProfile.dislikedMedia
      .slice(0, 5)
      .map((m) => `"${m.title}" (${m.genres.join(', ')})${m.reason ? ` - ${m.reason}` : ''}`)
      .join('; ') || 'none';

    return `You are a film recommendation engine. Given a user's taste profile and a candidate movie or TV show, write a brief, engaging explanation in 2-3 sentences of why this candidate is a good match. Also give a match score from 0 to 100.

User taste profile:
- Genres liked: ${likedGenres}
- Genres disliked: ${dislikedGenres}
- Titles liked: ${likedTitles}
- Titles disliked: ${dislikedTitles}
- Total liked: ${userProfile.likedCount}

Candidate:
- Title: ${candidate.title}
- Genres: ${candidate.genres.join(', ')}
- Rating: ${candidate.voteAverage}/10 (${candidate.voteCount} votes)
${candidate.releaseYear ? `- Year: ${candidate.releaseYear}` : ''}
${candidate.runtime ? `- Runtime: ${candidate.runtime} min` : ''}
- Overview: ${candidate.overview}

Reply with valid JSON only.`;
  }
}
