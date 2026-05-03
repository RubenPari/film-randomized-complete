import { plainToInstance } from 'class-transformer';
import { User } from '../../entities/user.entity.js';
import { LoginResponseDto } from '../dto/responses/login.response.dto.js';
import { UserResponseDto } from '../dto/responses/user.response.dto.js';

/**
 * Convert a User entity into the public response shape. `excludeExtraneousValues`
 * drops anything not marked `@Expose()` — a second barrier on top of the
 * `@Exclude()` decorators on User.password / resetToken.
 */
export function toUserResponse(user: User): UserResponseDto {
  return plainToInstance(
    UserResponseDto,
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    { excludeExtraneousValues: true },
  );
}

export function toLoginResponse(token: string, user: User): LoginResponseDto {
  return plainToInstance(
    LoginResponseDto,
    { token, user: toUserResponse(user) },
    { excludeExtraneousValues: true },
  );
}
