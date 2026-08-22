import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';

const UNIQUE_VIOLATION_CODE = '23505';

/**
 * Mappa l'errore di violazione del vincolo unico a un'eccezione di conflitto
 * @param err Errore di violazione del vincolo unico
 * @returns Eccezione di conflitto
 */
function mapUniqueViolation(err: QueryFailedError<any>): ConflictException {
  const constraint = (err.driverError as { constraint?: string } | undefined)
    ?.constraint;

  if (constraint === 'UQ_users_username') {
    return new ConflictException('Username already exists');
  }
  if (constraint === 'UQ_users_email') {
    return new ConflictException('Email already exists');
  }
  return new ConflictException('User already exists');
}

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Transactional user creation with DB-constraint-based conflict handling.
   */
  async registerUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(User);
      const entity = repo.create({ username, email, password });
      try {
        return await repo.save(entity);
      } catch (err) {
        if (
          err instanceof QueryFailedError &&
          (err.driverError as { code?: string } | undefined)?.code ===
            UNIQUE_VIOLATION_CODE
        ) {
          throw mapUniqueViolation(err);
        }
        throw err;
      }
    });
  }

  /**
   * Trova un utente per username
   * @param username Username dell'utente
   * @returns Utente trovato
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * Trova un utente per email
   * @param email Email dell'utente
   * @returns Utente trovato
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Trova un utente per ID
   * @param id ID dell'utente
   * @returns Utente trovato
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Aggiorna il token di reset
   * @param userId ID dell'utente
   * @param resetToken Token di reset
   * @param resetTokenExpiry Scadenza del token di reset
   */
  async updateResetToken(
    userId: string,
    resetToken: string | null,
    resetTokenExpiry: Date | null,
  ): Promise<void> {
    await this.userRepository.update(userId, { resetToken, resetTokenExpiry });
  }

  /**
   * Aggiorna la password
   * @param userId ID dell'utente
   * @param newPassword Nuova password
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: newPassword });
  }

  /**
   * Atomically consumes a reset token and updates the password.
   * Returns false when the token is missing/expired/doesn't match.
   */
  async consumeResetTokenAndUpdatePassword(
    userId: string,
    resetToken: string,
    newPassword: string,
  ): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(User);
      const user = await repo
        .createQueryBuilder('user')
        .setLock('pessimistic_write')
        .where('user.id = :id', { id: userId })
        .getOne();

      if (
        !user ||
        user.resetToken !== resetToken ||
        !user.resetTokenExpiry ||
        new Date() > new Date(user.resetTokenExpiry)
      ) {
        return false;
      }

      await repo.update(user.id, {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      return true;
    });
  }
}
