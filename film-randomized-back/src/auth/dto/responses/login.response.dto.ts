import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user.response.dto.js';

export class LoginResponseDto {
  @Expose()
  token: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
