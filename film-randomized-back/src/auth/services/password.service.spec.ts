import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PasswordService } from './password.service.js';
import { TokenService } from './token.service.js';
import { UsersService } from '../../users/users.service.js';
import { EmailService } from '../../email/email.service.js';
import { User } from '../../entities/user.entity.js';

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
    consumeResetTokenAndUpdatePassword: jest.fn(),
  };

  const tokenService = {
    issueResetToken: jest.fn().mockReturnValue('signed.token'),
    verifyResetToken: jest.fn(),
    hashPassword: jest.fn().mockResolvedValue('newhash'),
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  const emailService = {
    sendPasswordResetEmail: jest.fn(),
  };

  async function createService(): Promise<PasswordService> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        { provide: UsersService, useValue: usersService },
        { provide: TokenService, useValue: tokenService },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();
    return module.get(PasswordService);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now: now.getTime() });
    tokenService.issueResetToken.mockReturnValue('signed.token');
    tokenService.hashPassword.mockResolvedValue('newhash');
    tokenService.comparePassword.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('forgotPassword', () => {
    it('returns the generic response for unknown emails (no enumeration)', async () => {
      const service = await createService();
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword('unknown@example.com');

      expect(result.message).toContain('If an account');
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('issues a reset token and sends an email for known users', async () => {
      const service = await createService();
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
      const service = await createService();
      tokenService.verifyResetToken.mockImplementation(() => {
        throw new Error('bad signature');
      });

      await expect(service.resetPassword('bad', 'newpw12345')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects tokens whose stored expiry has passed', async () => {
      const service = await createService();
      tokenService.verifyResetToken.mockReturnValue({ sub: 'user-id' });
      usersService.consumeResetTokenAndUpdatePassword.mockResolvedValue(false);

      await expect(service.resetPassword('tok', 'newpw12345')).rejects.toThrow(
        'Invalid or expired reset token',
      );
    });

    it('updates the password and clears the reset token on success', async () => {
      const service = await createService();
      tokenService.verifyResetToken.mockReturnValue({ sub: 'user-id' });
      usersService.consumeResetTokenAndUpdatePassword.mockResolvedValue(true);

      const result = await service.resetPassword('tok', 'newpw12345');

      expect(
        usersService.consumeResetTokenAndUpdatePassword,
      ).toHaveBeenCalledWith('user-id', 'tok', 'newhash');
      expect(result.message).toContain('reset');
    });

    it('rejects when the stored token does not match', async () => {
      const service = await createService();
      tokenService.verifyResetToken.mockReturnValue({ sub: 'user-id' });
      usersService.consumeResetTokenAndUpdatePassword.mockResolvedValue(false);

      await expect(service.resetPassword('tok', 'newpw12345')).rejects.toThrow(
        'Invalid or expired reset token',
      );
    });
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
