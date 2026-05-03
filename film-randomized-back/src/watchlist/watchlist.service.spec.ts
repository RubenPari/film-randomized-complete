import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchlistService } from './watchlist.service.js';
import { WatchlistItem } from '../entities/watchlist-item.entity.js';
import { TmdbMediaPayloadDto } from '../common/dto/tmdb-media-payload.dto.js';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let repository: Repository<WatchlistItem>;

  const mockWatchlistRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        {
          provide: getRepositoryToken(WatchlistItem),
          useValue: mockWatchlistRepository,
        },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
    repository = module.get<Repository<WatchlistItem>>(
      getRepositoryToken(WatchlistItem),
    );

    jest.clearAllMocks();
  });

  describe('create', () => {
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

    it('should create a watchlist item using the shared mapper', async () => {
      mockWatchlistRepository.findOne.mockResolvedValue(null);
      mockWatchlistRepository.save.mockImplementation((entity) =>
        Promise.resolve({ id: 'item-id', ...entity }),
      );

      const result = await service.create(mockUserId, createDto);

      expect(result.tmdbId).toBe(12345);
      expect(result.mediaType).toBe('movie');
      expect(result.title).toBe('Test Movie');
      expect(result.userId).toBe(mockUserId);
      // every TMDb-shaped field on the DTO must round-trip through the mapper
      expect(result.posterPath).toBe('/poster.jpg');
      expect(result.voteAverage).toBe(7.5);
      expect(result.runtime).toBe(120);
      expect(mockWatchlistRepository.save).toHaveBeenCalledTimes(1);
      expect(mockWatchlistRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tmdbId: 12345,
          mediaType: 'movie',
          userId: mockUserId,
        }),
      );
    });

    it('should throw ConflictException if item already exists', async () => {
      mockWatchlistRepository.findOne.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        'Item already in watchlist',
      );
      expect(mockWatchlistRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all watchlist items for a user', async () => {
      const mockItems = [
        { id: '1', tmdbId: 12345, title: 'Movie 1', userId: mockUserId },
        { id: '2', tmdbId: 67890, title: 'Movie 2', userId: mockUserId },
      ];
      mockWatchlistRepository.find.mockResolvedValue(mockItems);

      const result = await service.findAll(mockUserId);

      expect(result).toHaveLength(2);
      expect(mockWatchlistRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOneByTmdbId', () => {
    it('should return a watchlist item by tmdbId', async () => {
      const mockItem = {
        id: '1',
        tmdbId: 12345,
        title: 'Test Movie',
        userId: mockUserId,
      };
      mockWatchlistRepository.findOne.mockResolvedValue(mockItem);

      const result = await service.findOneByTmdbId(12345, mockUserId);

      expect(result.tmdbId).toBe(12345);
    });

    it('should throw NotFoundException if item not found', async () => {
      mockWatchlistRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneByTmdbId(99999, mockUserId)).rejects.toThrow(
        'Item not found in watchlist',
      );
    });
  });

  describe('remove', () => {
    it('should delete in a single query and not call findOne first', async () => {
      mockWatchlistRepository.delete.mockResolvedValue({
        affected: 1,
        raw: [],
      });

      await service.remove(12345, mockUserId);

      expect(mockWatchlistRepository.delete).toHaveBeenCalledWith({
        tmdbId: 12345,
        userId: mockUserId,
      });
      expect(mockWatchlistRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when delete affects 0 rows', async () => {
      mockWatchlistRepository.delete.mockResolvedValue({
        affected: 0,
        raw: [],
      });

      await expect(service.remove(99999, mockUserId)).rejects.toThrow(
        'Item not found in watchlist',
      );
    });
  });
});
