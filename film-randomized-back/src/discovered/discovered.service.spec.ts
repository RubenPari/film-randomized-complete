import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiscoveredService } from './discovered.service.js';
import { DiscoveredItem } from '../entities/discovered-item.entity.js';
import { TmdbMediaPayloadDto } from '../common/dto/tmdb-media-payload.dto.js';
import { MediaType } from '../common/enums/media-type.enum.js';

describe('DiscoveredService', () => {
  let service: DiscoveredService;

  const mockDiscoveredRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserId = 'user-123';

  const createDto: TmdbMediaPayloadDto = {
    tmdb_id: 12345,
    media_type: 'movie',
    title: 'Test Movie',
    original_title: 'Test Movie Original',
    overview: 'Test overview',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    vote_average: 7.5,
    vote_count: 100,
    release_date: '2024-01-01',
    genres: '[]',
    runtime: 120,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscoveredService,
        {
          provide: getRepositoryToken(DiscoveredItem),
          useValue: mockDiscoveredRepository,
        },
      ],
    }).compile();

    service = module.get<DiscoveredService>(DiscoveredService);

    jest.clearAllMocks();
  });

  describe('record', () => {
    it('should save a new discovered item via the shared mapper', async () => {
      mockDiscoveredRepository.findOne.mockResolvedValue(null);
      mockDiscoveredRepository.save.mockImplementation((entity) =>
        Promise.resolve({ id: 'item-id', ...entity }),
      );

      const result = await service.record(mockUserId, createDto);

      expect(result.tmdbId).toBe(12345);
      expect(result.mediaType).toBe('movie');
      expect(result.title).toBe('Test Movie');
      expect(result.userId).toBe(mockUserId);
      expect(result.posterPath).toBe('/poster.jpg');
      expect(mockDiscoveredRepository.save).toHaveBeenCalledTimes(1);
      expect(mockDiscoveredRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tmdbId: 12345,
          mediaType: 'movie',
          userId: mockUserId,
        }),
      );
    });

    it('should return existing item without saving again (idempotent)', async () => {
      const existing = {
        id: 'existing-id',
        tmdbId: 12345,
        mediaType: 'movie',
        title: 'Test Movie',
        userId: mockUserId,
      };
      mockDiscoveredRepository.findOne.mockResolvedValue(existing);

      const result = await service.record(mockUserId, createDto);

      expect(result).toBe(existing);
      expect(mockDiscoveredRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all discovered items for a user', async () => {
      const mockItems = [
        { id: '1', tmdbId: 12345, title: 'Movie 1', userId: mockUserId },
        { id: '2', tmdbId: 67890, title: 'Movie 2', userId: mockUserId },
      ];
      mockDiscoveredRepository.find.mockResolvedValue(mockItems);

      const result = await service.findAll(mockUserId);

      expect(result).toHaveLength(2);
      expect(mockDiscoveredRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('remove', () => {
    it('should delete in a single query keyed by (mediaType, tmdbId, userId)', async () => {
      mockDiscoveredRepository.delete.mockResolvedValue({
        affected: 1,
        raw: [],
      });

      await service.remove(MediaType.MOVIE, 12345, mockUserId);

      expect(mockDiscoveredRepository.delete).toHaveBeenCalledWith({
        mediaType: MediaType.MOVIE,
        tmdbId: 12345,
        userId: mockUserId,
      });
      expect(mockDiscoveredRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when delete affects 0 rows', async () => {
      mockDiscoveredRepository.delete.mockResolvedValue({
        affected: 0,
        raw: [],
      });

      await expect(
        service.remove(MediaType.MOVIE, 99999, mockUserId),
      ).rejects.toThrow('Item not found in discovered list');
    });
  });
});
