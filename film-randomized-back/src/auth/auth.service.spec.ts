import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { PasswordService } from './services/password.service.js';
import { RegistrationService } from './services/registration.service.js';
import { TokenService } from './services/token.service.js';
import { UsersService } from '../users/users.service.js';
import { User } from '../entities/user.entity.js';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: Partial<User> = {
    id: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  const mockUsersService = {
    registerUser: jest.fn(),
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockTokenService = {
    comparePassword: jest.fn(),
    issueAccessToken: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockRegistrationService = {
    register: jest.fn(),
  };

  const mockPasswordService = {
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: RegistrationService, useValue: mockRegistrationService },
        { provide: PasswordService, useValue: mockPasswordService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('delegates to RegistrationService', async () => {
      mockRegistrationService.register.mockResolvedValue({
        token: 'mock-jwt-token',
        user: {
          id: 'test-user-id',
          username: 'testuser',
          email: 'test@example.com',
        },
      });

      const result = await service.register(
        'testuser',
        'test@example.com',
        'password123',
      );

      expect(mockRegistrationService.register).toHaveBeenCalledWith(
        'testuser',
        'test@example.com',
        'password123',
      );
      expect(result).toHaveProperty('token', 'mock-jwt-token');
    });
  });

  describe('login', () => {
    it('should login with correct credentials', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockTokenService.comparePassword.mockResolvedValue(true);

      const result = await service.login('testuser', 'password123');

      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result.user).toHaveProperty('username', 'testuser');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(service.login('testuser', 'password123')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockTokenService.comparePassword.mockResolvedValue(false);

      await expect(service.login('testuser', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('getMe', () => {
    it('should return user data', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.getMe('test-user-id');

      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('throws NotFoundException if user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.getMe('invalid-id')).rejects.toThrow(
        'User not found',
      );
    });

    it('never exposes the password field on the serialized response', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.getMe('test-user-id');

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('password operations delegate', () => {
    it('changePassword delegates to PasswordService', async () => {
      mockPasswordService.changePassword.mockResolvedValue({ message: 'ok' });
      await service.changePassword('user-id', 'old', 'newPassword12345');
      expect(mockPasswordService.changePassword).toHaveBeenCalledWith(
        'user-id',
        'old',
        'newPassword12345',
      );
    });
  });
});
