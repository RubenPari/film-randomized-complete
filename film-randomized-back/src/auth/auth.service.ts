import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { PasswordService } from './services/password.service.js';
import { RegistrationService } from './services/registration.service.js';
import { TokenService } from './services/token.service.js';
import {
  toLoginResponse,
  toUserResponse,
} from './mappers/auth-response.mapper.js';
import { LoginResponseDto } from './dto/responses/login.response.dto.js';
import { UserResponseDto } from './dto/responses/user.response.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly registrationService: RegistrationService,
    private readonly passwordService: PasswordService,
  ) {}

  register(
    username: string,
    email: string,
    password: string,
  ): Promise<LoginResponseDto> {
    return this.registrationService.register(username, email, password);
  }

  async login(username: string, password: string): Promise<LoginResponseDto> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.tokenService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.tokenService.issueAccessToken(user);

    return toLoginResponse(token, user);
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toUserResponse(user);
  }

  forgotPassword(email: string) {
    return this.passwordService.forgotPassword(email);
  }

  resetPassword(token: string, newPassword: string) {
    return this.passwordService.resetPassword(token, newPassword);
  }

  changePassword(userId: string, currentPassword: string, newPassword: string) {
    return this.passwordService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
}
