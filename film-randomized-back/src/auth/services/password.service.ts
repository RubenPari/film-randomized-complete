import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity.js';
import { EmailService } from '../../email/email.service.js';
import { UsersService } from '../../users/users.service.js';
import { MessageResponseDto } from '../dto/responses/message.response.dto.js';

const BCRYPT_SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RESET_ERROR_MESSAGE = 'Invalid or expired reset token';

@Injectable()
export class PasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
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

    const resetToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '1h' },
    );
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
      payload = this.jwtService.verify<{ sub: string }>(token);
    } catch {
      throw new BadRequestException(RESET_ERROR_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(User);
      const user = await repo
        .createQueryBuilder('user')
        .setLock('pessimistic_write')
        .where('user.id = :id', { id: payload.sub })
        .getOne();

      if (
        !user ||
        user.resetToken !== token ||
        !user.resetTokenExpiry ||
        new Date() > new Date(user.resetTokenExpiry)
      ) {
        throw new BadRequestException(RESET_ERROR_MESSAGE);
      }

      await repo.update(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });
    });

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

    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      BCRYPT_SALT_ROUNDS,
    );
    await this.usersService.updatePassword(userId, hashedNewPassword);

    return { message: 'Password changed successfully' };
  }
}
