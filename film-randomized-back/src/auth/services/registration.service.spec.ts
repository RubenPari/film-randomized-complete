import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getDataSourceToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RegistrationService } from './registration.service.js';
import { User } from '../../entities/user.entity.js';

jest.mock('bcryptjs');

/**
 * The transaction path is exercised by supplying a fake DataSource whose
 * `transaction` callback executes synchronously against a mock manager/repo.
 * This lets the spec verify both the success and the unique-violation mapping
 * without booting a real database.
 */
function buildDataSource(repoBehaviour: {
  save: jest.Mock;
  create?: jest.Mock;
}) {
  const repo = {
    create: repoBehaviour.create ?? jest.fn((input) => input),
    save: repoBehaviour.save,
  };
  return {
    transaction: jest.fn(
      async (cb: (manager: { getRepository: jest.Mock }) => unknown) =>
        cb({ getRepository: jest.fn().mockReturnValue(repo) }),
    ),
  };
}

function uniqueViolation(constraint: string): QueryFailedError {
  const err = new QueryFailedError('insert', [], new Error(constraint));
  (err as unknown as { driverError: { code: string; constraint: string } }).driverError = {
    code: '23505',
    constraint,
  };
  return err;
}

describe('RegistrationService', () => {
  const mockUser: Partial<User> = {
    id: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  async function createService(dataSource: unknown): Promise<RegistrationService> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getDataSourceToken(), useValue: dataSource },
      ],
    }).compile();
    return module.get(RegistrationService);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
  });

  it('registers a new user and returns a login payload', async () => {
    const save = jest.fn().mockResolvedValue(mockUser);
    const service = await createService(buildDataSource({ save }));

    const result = await service.register(
      'testuser',
      'test@example.com',
      'password123',
    );

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(save).toHaveBeenCalled();
    expect(result.token).toBe('mock-jwt-token');
    expect(result.user.username).toBe('testuser');
    expect(result.user).not.toHaveProperty('password');
  });

  it('maps a username unique violation to ConflictException', async () => {
    const save = jest.fn().mockRejectedValue(uniqueViolation('UQ_users_username'));
    const service = await createService(buildDataSource({ save }));

    await expect(
      service.register('testuser', 'test@example.com', 'password123'),
    ).rejects.toThrow('Username already exists');
  });

  it('maps an email unique violation to ConflictException', async () => {
    const save = jest.fn().mockRejectedValue(uniqueViolation('UQ_users_email'));
    const service = await createService(buildDataSource({ save }));

    await expect(
      service.register('testuser', 'test@example.com', 'password123'),
    ).rejects.toThrow('Email already exists');
  });

  it('rethrows non-unique QueryFailedError as-is', async () => {
    const err = new QueryFailedError('insert', [], new Error('boom'));
    (err as unknown as { driverError: { code: string } }).driverError = {
      code: '42P01',
    };
    const save = jest.fn().mockRejectedValue(err);
    const service = await createService(buildDataSource({ save }));

    await expect(
      service.register('testuser', 'test@example.com', 'password123'),
    ).rejects.toBe(err);
  });
});
