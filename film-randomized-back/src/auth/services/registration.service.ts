import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity.js';
import { LoginResponseDto } from '../dto/responses/login.response.dto.js';
import { toLoginResponse } from '../mappers/auth-response.mapper.js';

const BCRYPT_SALT_ROUNDS = 10;
const UNIQUE_VIOLATION_CODE = '23505';

/**
 * Maps a Postgres unique-constraint error onto a user-facing ConflictException.
 * Using the constraint name (not the column) lets us stay stable across schema
 * changes and avoids duplicating the pre-check logic outside the transaction.
 */
function mapUniqueViolation(err: QueryFailedError): ConflictException {
  const constraint = (err.driverError as { constraint?: string } | undefined)
    ?.constraint;

  if (constraint === 'UQ_users_username') {
    return new ConflictException('Username already exists');
  }
  if (constraint === 'UQ_users_email') {
    return new ConflictException('Email already exists');
  }
  return new ConflictException('User already exists');
}

@Injectable()
export class RegistrationService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a user atomically. The insert is wrapped in a transaction so the
   * only failure mode is the DB unique constraint, which we translate into a
   * typed ConflictException. This removes the prior check-then-insert race.
   */
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<LoginResponseDto> {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(User);
      const entity = repo.create({ username, email, password: hashedPassword });
      try {
        return await repo.save(entity);
      } catch (err) {
        if (
          err instanceof QueryFailedError &&
          (err.driverError as { code?: string } | undefined)?.code ===
            UNIQUE_VIOLATION_CODE
        ) {
          throw mapUniqueViolation(err);
        }
        throw err;
      }
    });

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return toLoginResponse(token, user);
  }
}
