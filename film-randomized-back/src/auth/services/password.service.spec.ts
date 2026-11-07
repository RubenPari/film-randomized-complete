import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service.js';
import { TokenService } from './token.service.js';
import { UsersService } from '../../users/users.service.js';
import { User } from '../../entities/user.entity.js';

describe('PasswordService', () => {
  const now = new Date('2026-04-10T10:00:00Z');

  const baseUser: User = {
    id: 'user-id',
    username: 'alice',
    email: 'alice@example.com',
    password: 'oldhash',
    createdAt: now,
    updatedAt: now,
    watchlistItems: [],
    discoveredItems: [],
  };

  const usersService = {
    findById: jest.fn(),
    updatePassword: jest.fn(),
  };

  const tokenService = {
    hashPassword: jest.fn().mockResolvedValue('newhash'),
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  async function createService(): Promise<PasswordService> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        { provide: UsersService, useValue: usersService },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();
    return module.get(PasswordService);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now: now.getTime() });
    tokenService.hashPassword.mockResolvedValue('newhash');
    tokenService.comparePassword.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('changePassword', () => {
    it('rejects when the current password is wrong', async () => {
      const service = await createService();
      usersService.findById.mockResolvedValue(baseUser);
      tokenService.comparePassword.mockResolvedValue(false);

      await expect(
        service.changePassword('user-id', 'wrong', 'newpw12345'),
      ).rejects.toThrow('Current password is incorrect');
    });

    it('hashes and persists the new password', async () => {
      const service = await createService();
      usersService.findById.mockResolvedValue(baseUser);

      const result = await service.changePassword(
        'user-id',
        'oldpw',
        'newpw12345',
      );

      expect(tokenService.hashPassword).toHaveBeenCalledWith('newpw12345');
      expect(usersService.updatePassword).toHaveBeenCalledWith(
        'user-id',
        'newhash',
      );
      expect(result.message).toContain('changed');
    });
  });
});
