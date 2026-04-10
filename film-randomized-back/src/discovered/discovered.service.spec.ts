import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiscoveredService } from './discovered.service.js';
import { DiscoveredItem } from '../entities/discovered-item.entity.js';
import { CreateWatchlistDto } from '../watchlist/dto/create-watchlist.dto.js';

describe('DiscoveredService', () => {
  let service: DiscoveredService;

  const mockDiscoveredRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserId = 'user-123';

  const createDto: CreateWatchlistDto = {
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
    it('should save a new discovered item', async () => {
      mockDiscoveredRepository.findOne.mockResolvedValue(null);
      mockDiscoveredRepository.save.mockResolvedValue({
        id: 'item-id',
        tmdbId: 12345,
        mediaType: 'movie',
        title: 'Test Movie',
        userId: mockUserId,
      });

      const result = await service.record(mockUserId, createDto);

      expect(result.tmdbId).toBe(12345);
      expect(mockDiscoveredRepository.save).toHaveBeenCalled();
    });

    it('should return existing item without saving again', async () => {
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
    it('should remove a discovered item', async () => {
      const mockItem = {
        id: '1',
        tmdbId: 12345,
        mediaType: 'movie',
        userId: mockUserId,
      };
      mockDiscoveredRepository.findOne.mockResolvedValue(mockItem);

      await service.remove('movie', 12345, mockUserId);

      expect(mockDiscoveredRepository.remove).toHaveBeenCalledWith(mockItem);
    });

    it('should throw if item not found', async () => {
      mockDiscoveredRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('movie', 99999, mockUserId)).rejects.toThrow(
        'Item not found in discovered list',
      );
    });
  });
});
