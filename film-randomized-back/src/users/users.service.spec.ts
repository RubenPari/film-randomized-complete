import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service.js';
import { User } from '../entities/user.entity.js';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Pick<Repository<User>, 'findOne' | 'save' | 'update'>>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<
      Pick<Repository<User>, 'findOne' | 'save' | 'update'>
    >;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('create persists a user entity with the given credentials', async () => {
    repo.save.mockImplementation(async (u) => ({ id: 'uid', ...u }) as User);

    const result = await service.create('alice', 'a@b.com', 'hashed');

    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'alice',
        email: 'a@b.com',
        password: 'hashed',
      }),
    );
    expect(result.username).toBe('alice');
  });

  it('findByUsername queries by username', async () => {
    repo.findOne.mockResolvedValue({ id: 'uid' } as User);

    await service.findByUsername('alice');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { username: 'alice' } });
  });

  it('findByEmail queries by email', async () => {
    repo.findOne.mockResolvedValue(null);

    await service.findByEmail('a@b.com');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
  });

  it('updatePasswordAndClearResetToken clears token fields atomically', async () => {
    await service.updatePasswordAndClearResetToken('uid', 'newhash');

    expect(repo.update).toHaveBeenCalledWith('uid', {
      password: 'newhash',
      resetToken: null,
      resetTokenExpiry: null,
    });
  });
});
