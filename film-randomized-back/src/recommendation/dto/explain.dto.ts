import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GenreDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

class MediaFeedbackDto {
  @IsString()
  title: string;

  @IsString()
  overview: string;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsOptional()
  @IsString()
  reason?: string;
}

class UserProfileDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenreDto)
  likedGenres: GenreDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenreDto)
  dislikedGenres: GenreDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaFeedbackDto)
  likedMedia: MediaFeedbackDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaFeedbackDto)
  dislikedMedia: MediaFeedbackDto[];

  @IsNumber()
  likedCount: number;
}

class CandidateDto {
  @IsString()
  title: string;

  @IsString()
  overview: string;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsNumber()
  voteAverage: number;

  @IsNumber()
  voteCount: number;

  @IsOptional()
  @IsNumber()
  releaseYear?: number;

  @IsOptional()
  @IsNumber()
  runtime?: number;
}

export class ExplainRecommendationDto {
  @ValidateNested()
  @Type(() => UserProfileDto)
  userProfile: UserProfileDto;

  @ValidateNested()
  @Type(() => CandidateDto)
  candidate: CandidateDto;
}
