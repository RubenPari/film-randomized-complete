import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity.js';
import {
  ACCESS_TOKEN_TTL,
  BCRYPT_SALT_ROUNDS,
} from '../constants/auth.constants.js';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  comparePassword(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }

  issueAccessToken(user: Pick<User, 'id' | 'username'>): string {
    return this.jwtService.sign(
      { sub: user.id, username: user.username },
      { expiresIn: ACCESS_TOKEN_TTL },
    );
  }
}
