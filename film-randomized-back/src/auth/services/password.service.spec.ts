import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getDataSourceToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PasswordService } from './password.service.js';
import { UsersService } from '../../users/users.service.js';
import { EmailService } from '../../email/email.service.js';
import { User } from '../../entities/user.entity.js';

jest.mock('bcryptjs');

/**
 * Minimal fake DataSource whose `transaction` callback runs against a mock
 * repository. This lets the reset-password path exercise the find-then-update
 * flow without spinning up a database.
 */
function buildDataSource(user: User | null) {
  const qb = {
    setLock: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(user),
  };
  const update = jest.fn().mockResolvedValue({ affected: 1 });
  const repo = {
    createQueryBuilder: jest.fn().mockReturnValue(qb),
    update,
  };
  const ds = {
    transaction: jest.fn(async (cb: (m: { getRepository: jest.Mock }) => unknown) =>
      cb({ getRepository: jest.fn().mockReturnValue(repo) }),
    ),
  };
  return { ds, update, qb };
}

describe('PasswordService', () => {
  const now = new Date('2026-04-10T10:00:00Z');
  const validExpiry = new Date(now.getTime() + 30 * 60 * 1000);

  const baseUser: User = {
    id: 'user-id',
    username: 'alice',
    email: 'alice@example.com',
    password: 'oldhash',
    resetToken: 'tok',
    resetTokenExpiry: validExpiry,
    createdAt: now,
    updatedAt: now,
    watchlistItems: [],
    discoveredItems: [],
  };

  const usersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateResetToken: jest.fn(),
    updatePassword: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn().mockReturnValue('signed.token'),
    verify: jest.fn(),
  };

  const emailService = {
    sendPasswordResetEmail: jest.fn(),
  };

  async function createService(datasource: unknown): Promise<PasswordService> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: EmailService, useValue: emailService },
        { provide: getDataSourceToken(), useValue: datasource },
      ],
    }).compile();
    return module.get(PasswordService);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now: now.getTime() });
    (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('forgotPassword', () => {
    it('returns the generic response for unknown emails (no enumeration)', async () => {
      const { ds } = buildDataSource(null);
      const service = await createService(ds);
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword('unknown@example.com');

      expect(result.message).toContain('If an account');
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('issues a reset token and sends an email for known users', async () => {
      const { ds } = buildDataSource(null);
      const service = await createService(ds);
      usersService.findByEmail.mockResolvedValue(baseUser);

      await service.forgotPassword('alice@example.com');

      expect(usersService.updateResetToken).toHaveBeenCalledWith(
        'user-id',
        'signed.token',
        expect.any(Date),
      );
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'alice@example.com',
        'signed.token',
      );
    });
  });

  describe('resetPassword', () => {
    it('rejects tokens that fail JWT verification', async () => {
      const { ds } = buildDataSource(null);
      const service = await createService(ds);
      jwtService.verify.mockImplementation(() => {
        throw new Error('bad signature');
      });

      await expect(service.resetPassword('bad', 'newpw12345')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects tokens whose stored expiry has passed', async () => {
      const expired = { ...baseUser, resetTokenExpiry: new Date(now.getTime() - 1) };
      const { ds } = buildDataSource(expired);
      const service = await createService(ds);
      jwtService.verify.mockReturnValue({ sub: 'user-id' });

      await expect(service.resetPassword('tok', 'newpw12345')).rejects.toThrow(
        'Invalid or expired reset token',
      );
    });

    it('updates the password and clears the reset token on success', async () => {
      const { ds, update } = buildDataSource(baseUser);
      const service = await createService(ds);
      jwtService.verify.mockReturnValue({ sub: 'user-id' });

      const result = await service.resetPassword('tok', 'newpw12345');

      expect(update).toHaveBeenCalledWith('user-id', {
        password: 'newhash',
        resetToken: null,
        resetTokenExpiry: null,
      });
      expect(result.message).toContain('reset');
    });

    it('rejects when the stored token does not match', async () => {
      const mismatched = { ...baseUser, resetToken: 'different' };
      const { ds } = buildDataSource(mismatched);
      const service = await createService(ds);
      jwtService.verify.mockReturnValue({ sub: 'user-id' });

      await expect(service.resetPassword('tok', 'newpw12345')).rejects.toThrow(
        'Invalid or expired reset token',
      );
    });
  });

  describe('changePassword', () => {
    it('rejects when the current password is wrong', async () => {
      const { ds } = buildDataSource(null);
      const service = await createService(ds);
      usersService.findById.mockResolvedValue(baseUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('user-id', 'wrong', 'newpw12345'),
      ).rejects.toThrow('Current password is incorrect');
    });

    it('hashes and persists the new password', async () => {
      const { ds } = buildDataSource(null);
      const service = await createService(ds);
      usersService.findById.mockResolvedValue(baseUser);

      const result = await service.changePassword(
        'user-id',
        'oldpw',
        'newpw12345',
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('newpw12345', 10);
      expect(usersService.updatePassword).toHaveBeenCalledWith(
        'user-id',
        'newhash',
      );
      expect(result.message).toContain('changed');
    });
  });
});
