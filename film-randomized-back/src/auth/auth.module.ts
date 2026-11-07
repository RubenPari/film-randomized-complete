import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { PasswordService } from './services/password.service.js';
import { RegistrationService } from './services/registration.service.js';
import { TokenService } from './services/token.service.js';
import { ACCESS_TOKEN_TTL } from './constants/auth.constants.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        return {
          secret,
          signOptions: { expiresIn: ACCESS_TOKEN_TTL },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RegistrationService,
    PasswordService,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
