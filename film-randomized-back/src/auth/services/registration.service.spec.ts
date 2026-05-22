import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './registration.service.js';
import { TokenService } from './token.service.js';
import { UsersService } from '../../users/users.service.js';
import { User } from '../../entities/user.entity.js';

describe('RegistrationService', () => {
  const mockUser: Partial<User> = {
    id: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockUsersService = {
    registerUser: jest.fn(),
  };

  const mockTokenService = {
    hashPassword: jest.fn().mockResolvedValue('hashedpassword'),
    issueAccessToken: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  async function createService(): Promise<RegistrationService> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();
    return module.get(RegistrationService);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user and returns a login payload', async () => {
    mockUsersService.registerUser.mockResolvedValue(mockUser);
    const service = await createService();

    const result = await service.register(
      'testuser',
      'test@example.com',
      'password123',
    );

    expect(mockTokenService.hashPassword).toHaveBeenCalledWith('password123');
    expect(mockUsersService.registerUser).toHaveBeenCalledWith(
      'testuser',
      'test@example.com',
      'hashedpassword',
    );
    expect(result.token).toBe('mock-jwt-token');
    expect(result.user.username).toBe('testuser');
    expect(result.user).not.toHaveProperty('password');
  });

  it('propagates user-registration conflicts from UsersService', async () => {
    mockUsersService.registerUser.mockRejectedValue(
      new Error('Username already exists'),
    );
    const service = await createService();

    await expect(
      service.register('testuser', 'test@example.com', 'password123'),
    ).rejects.toThrow('Username already exists');
  });
});
