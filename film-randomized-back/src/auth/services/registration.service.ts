import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service.js';
import { LoginResponseDto } from '../dto/responses/login.response.dto.js';
import { toLoginResponse } from '../mappers/auth-response.mapper.js';
import { TokenService } from './token.service.js';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
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
    const hashedPassword = await this.tokenService.hashPassword(password);
    const user = await this.usersService.registerUser(
      username,
      email,
      hashedPassword,
    );
    const token = this.tokenService.issueAccessToken(user);

    return toLoginResponse(token, user);
  }
}
