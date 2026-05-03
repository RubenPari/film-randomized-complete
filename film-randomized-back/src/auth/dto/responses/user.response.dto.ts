import { Expose } from 'class-transformer';

/**
 * Canonical public shape of a user. Built with `excludeExtraneousValues: true`
 * so any property NOT decorated with `@Expose` is stripped — including
 * `password`, `resetToken`, and `resetTokenExpiry`.
 */
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}
