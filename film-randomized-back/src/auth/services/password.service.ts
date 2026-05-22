import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailService } from '../../email/email.service.js';
import { UsersService } from '../../users/users.service.js';
import { MessageResponseDto } from '../dto/responses/message.response.dto.js';
import { TokenService } from './token.service.js';
import { RESET_TOKEN_TTL_MS } from '../constants/auth.constants.js';

const RESET_ERROR_MESSAGE = 'Invalid or expired reset token';

@Injectable()
export class PasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async forgotPassword(email: string): Promise<MessageResponseDto> {
    const user = await this.usersService.findByEmail(email);
    // Always return the same payload to prevent email enumeration attacks.
    const genericResponse: MessageResponseDto = {
      message:
        'If an account with that email exists, a reset link has been sent.',
    };

    if (!user) {
      return genericResponse;
    }

    const resetToken = this.tokenService.issueResetToken(user.id);
    await this.usersService.updateResetToken(
      user.id,
      resetToken,
      new Date(Date.now() + RESET_TOKEN_TTL_MS),
    );
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return genericResponse;
  }

  /**
   * Atomically verifies the reset token and updates the password. The read
   * (SELECT ... FOR UPDATE) and write run inside a single transaction so a
   * concurrent request racing on the same token cannot consume it twice.
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<MessageResponseDto> {
    let payload: { sub: string };
    try {
      payload = this.tokenService.verifyResetToken(token);
    } catch {
      throw new BadRequestException(RESET_ERROR_MESSAGE);
    }

    const hashedPassword = await this.tokenService.hashPassword(newPassword);
    const updated = await this.usersService.consumeResetTokenAndUpdatePassword(
      payload.sub,
      token,
      hashedPassword,
    );
    if (!updated) {
      throw new BadRequestException(RESET_ERROR_MESSAGE);
    }

    return { message: 'Password has been reset successfully' };
  }

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
