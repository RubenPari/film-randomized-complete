import { NotFoundException } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { BaseMediaItem } from '../../entities/base-media-item.entity.js';
import { TmdbMediaPayloadDto } from '../dto/tmdb-media-payload.dto.js';
import {
  MediaItemConstructor,
  buildMediaItemFromTmdbPayload,
} from '../mappers/tmdb-media.mapper.js';

/**
 * Servizio condiviso per qualsiasi operazione CRUD su una raccolta multimediale per utente
 * (`watchlist`, `discovered`, `bookmarks`, ecc.).
 * 
 * I servizi concreti estendono questa classe e devono solo:
 *   - chiamare `super(repository, EntityClass, notFoundMessage)`;
 *   - decidere la propria semantica di conflitto in `create()` (lanciare eccezione o idempotente),
 *     possibilmente utilizzando `findOneFor()` come blocco di costruzione.
 * 
 * Mantenuto intenzionalmente snello: solo le operazioni che sono *letteralmente* identiche
 * tra watchlist e discovered vivono qui. Qualsiasi operazione più sottile (ad esempio la
 * decisione "lancia eccezione su duplicato" vs "restituisci esistente") rimane nella sottoclasse.
 */
export abstract class MediaCollectionService<T extends BaseMediaItem> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityCtor: MediaItemConstructor<T>,
    protected readonly notFoundMessage: string,
  ) { }

  /**
   * Restituisce ogni riga posseduta da `userId`, dal più recente al meno recente.
   */
  async findAll(userId: string): Promise<T[]> {
    return this.repository.find({
      where: { userId } as FindOptionsWhere<T>,
      order: { createdAt: 'DESC' } as FindOptionsOrder<T>,
    });
  }

  /**
   * Aiuto per la ricerca di una singola riga. Utilizzato dalle sottoclassi per implementare le proprie
   * regole di rilevamento dei conflitti / idempotenza.
   */
  protected findOneFor(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  protected async findOneOrThrow(where: FindOptionsWhere<T>): Promise<T> {
    const item = await this.findOneFor(where);
    if (!item) {
      throw new NotFoundException(this.notFoundMessage);
    }
    return item;
  }

  /**
   * Esegue il mapping del DTO a una nuova entità tramite {@link buildMediaItemFromTmdbPayload}
   * e la salva. Centralizzato in modo che il mapping abbia una sola origine.
   */
  protected saveFromDto(userId: string, dto: TmdbMediaPayloadDto): Promise<T> {
    const item = buildMediaItemFromTmdbPayload(this.entityCtor, userId, dto);
    return this.repository.save(item);
  }

  /**
   * Elimina le righe che corrispondono a `where` in un'unica istruzione e lancia
   * `NotFoundException` se non è stato eliminato nulla. Sostituisce il modello storico
   * `findOne + repository.remove()` (2 round-trip → 1).
   */
  protected async deleteWhere(where: FindOptionsWhere<T>): Promise<void> {
    const result = await this.repository.delete(where);
    if (!result.affected) {
      throw new NotFoundException(this.notFoundMessage);
    }
  }
}
