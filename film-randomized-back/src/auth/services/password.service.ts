import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service.js';
import { MessageResponseDto } from '../dto/responses/message.response.dto.js';
import { TokenService } from './token.service.js';

@Injectable()
export class PasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<MessageResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentValid = await this.tokenService.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await this.tokenService.hashPassword(newPassword);
    await this.usersService.updatePassword(userId, hashedNewPassword);

    return { message: 'Password changed successfully' };
  }
}
