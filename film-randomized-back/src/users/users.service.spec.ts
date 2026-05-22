import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { UsersService } from './users.service.js';
import { User } from '../entities/user.entity.js';

/**
 * Test per il servizio di utenti
 */
describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Pick<Repository<User>, 'findOne' | 'save' | 'update'>>;
  let dataSource: { transaction: jest.Mock };

  /**
   * Setup del test
   */
  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<Pick<Repository<User>, 'findOne' | 'save' | 'update'>>;

    dataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  /**
   * Test per il metodo registerUser
   */
  it('registerUser persists a user entity with the given credentials', async () => {
    const txRepo = {
      create: jest.fn().mockReturnValue({
        username: 'alice',
        email: 'a@b.com',
        password: 'hashed',
      }),
      save: jest.fn().mockResolvedValue({ id: 'uid', username: 'alice' }),
    };
    dataSource.transaction.mockImplementation(
      (cb: (manager: { getRepository: () => typeof txRepo }) => unknown) =>
        cb({ getRepository: () => txRepo }),
    );

    const result = await service.registerUser('alice', 'a@b.com', 'hashed');

    expect(txRepo.create).toHaveBeenCalledWith({
      username: 'alice',
      email: 'a@b.com',
      password: 'hashed',
    });
    expect(txRepo.save).toHaveBeenCalled();
    expect(result.username).toBe('alice');
  });

  /**
   * Test per il metodo findByUsername
   */
  it('findByUsername queries by username', async () => {
    repo.findOne.mockResolvedValue({ id: 'uid' } as User);

    await service.findByUsername('alice');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { username: 'alice' } });
  });

  /**
   * Test per il metodo findByEmail
   */
  it('findByEmail queries by email', async () => {
    repo.findOne.mockResolvedValue(null);

    await service.findByEmail('a@b.com');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
  });

  /**
   * Test per il metodo registerUser
   */
  it('registerUser maps unique constraint errors to conflict exceptions', async () => {
    const txRepo = {
      create: jest.fn(),
      save: jest.fn().mockRejectedValue(
        new QueryFailedError('INSERT', [], {
          code: '23505',
          constraint: 'UQ_users_username',
        }),
      ),
    };
    dataSource.transaction.mockImplementation(
      (cb: (manager: { getRepository: () => typeof txRepo }) => unknown) =>
        cb({ getRepository: () => txRepo }),
    );

    await expect(
      service.registerUser('alice', 'a@b.com', 'hashed'),
    ).rejects.toThrow('Username already exists');
  });

  /**
   * Test per il metodo consumeResetTokenAndUpdatePassword
   */
  it('consumeResetTokenAndUpdatePassword returns false when token mismatch', async () => {
    const txRepo = {
      createQueryBuilder: jest.fn().mockReturnValue({
        setLock: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: 'uid',
          resetToken: 'different',
          resetTokenExpiry: new Date(Date.now() + 1000),
        }),
      }),
      update: jest.fn(),
    };
    dataSource.transaction.mockImplementation(
      (cb: (manager: { getRepository: () => typeof txRepo }) => unknown) =>
        cb({ getRepository: () => txRepo }),
    );

    const updated = await service.consumeResetTokenAndUpdatePassword(
      'uid',
      'provided-token',
      'newhash',
    );

    expect(updated).toBe(false);
    expect(txRepo.update).not.toHaveBeenCalled();
  });
});
