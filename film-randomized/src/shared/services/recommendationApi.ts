import { apiClient, ApiError } from './apiClient.js';

export { ApiError };

export interface AiExplainResponse {
  explanation: string;
  matchScore: number;
}

export interface AiExplainRequest {
  userProfile: {
    likedGenres: { id: number; name: string }[];
    dislikedGenres: { id: number; name: string }[];
    likedMedia: { title: string; overview: string; genres: string[] }[];
    dislikedMedia: { title: string; overview: string; genres: string[]; reason?: string }[];
    likedCount: number;
  };
  candidate: {
    title: string;
    overview: string;
    genres: string[];
    voteAverage: number;
    voteCount: number;
    releaseYear?: number;
    runtime?: number | null;
  };
}

export const getAiExplanation = async (
  payload: AiExplainRequest,
  token: string,
): Promise<AiExplainResponse> => {
  return apiClient.post<AiExplainResponse>('/recommend/explain', payload, token);
};
