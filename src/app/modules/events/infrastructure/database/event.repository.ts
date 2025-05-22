import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Pagination, VentureEvent } from 'echadospalante-domain';
import {
  VentureData,
  VentureEventData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';

import { EventFilters } from '../../domain/core/event-filters';
import { EventsRepository } from '../../domain/gateway/database/events.repository';

@Injectable()
export class VentureEventsRepositoryImpl implements EventsRepository {
  private readonly logger = new Logger(VentureEventsRepositoryImpl.name);
  public constructor(
    @InjectRepository(VentureEventData)
    private eventsRepository: Repository<VentureEventData>,
  ) {}

  public existsBySlug(slug: string): Promise<boolean> {
    return this.eventsRepository.exists({ where: { slug } });
  }

  public isEventOwnerById(eventId: string, userId: string): Promise<boolean> {
    return this.eventsRepository
      .createQueryBuilder('event')
      .leftJoin('event.venture', 'venture')
      .leftJoin('venture.owner', 'owner')
      .leftJoin('owner.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('event.id = :eventId', { eventId })
      .getOne()
      .then((res) => res !== undefined);
  }

  public findById(id: string): Promise<VentureEvent | null> {
    return this.eventsRepository
      .findOneBy({ id })
      .then((event) => event as VentureEvent | null);
  }

  public deleteById(id: string): Promise<void> {
    return this.eventsRepository.delete({ id }).then((r) => {
      this.logger.log(`VentureEvent deleted: ${id} --> ${r.affected}`);
    });
  }

  // findBySlug(slug: string): Promise<VentureEvent | null> {
  //   return this.eventsRepository
  //     .findOneBy({ slug })
  //     .then((event) => event as VentureEvent | null);
  // }

  public save(event: VentureEvent, ventureId: string): Promise<VentureEvent> {
    return this.eventsRepository
      .save({ ...event, venture: { id: ventureId } as VentureData })
      .then((result) => JSON.parse(JSON.stringify(result)) as VentureEvent);
  }

  // existsBySlug(slug: string): Promise<boolean> {
  //   return this.eventsRepository.existsBy({ slug });
  // }

  public findAllByCriteria(
    filters: EventFilters,
    pagination: Pagination,
    ventureId?: string,
  ): Promise<{ items: VentureEvent[]; total: number }> {
    const {
      search,
      categoriesIds,
      // departmentId,
      // municipalityId,
      // point,
      // radius,
    } = filters;

    const query = this.eventsRepository.createQueryBuilder('event');

    // Agregar relaciones explícitamente (aunque tengan eager: true)
    query
      .leftJoinAndSelect('event.categories', 'category')
      .leftJoinAndSelect('event.location', 'location');

    // Filtros dinámicos
    if (search) {
      query.andWhere(
        '(event.name LIKE :term OR event.description LIKE :term OR event.slug LIKE :term)',
        { term: `%${search}%` },
      );
    }

    if (ventureId) {
      query.andWhere('event.venture.id = :ventureId', { ventureId });
    }

    if (categoriesIds?.length) {
      query.andWhere('category.id IN (:...ids)', { ids: categoriesIds });
    }

    query.skip(pagination.skip).take(pagination.take);

    return query.getManyAndCount().then(([items, total]) => {
      console.log({ items });
      return {
        items: JSON.parse(JSON.stringify(items)) as VentureEvent[],
        total,
      };
    });
  }
}
