import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pagination, VentureEvent } from 'echadospalante-core';
import { VentureEventData } from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';

import { EventsRepository } from '../../domain/gateway/database/events.repository';
import { EventFilters } from '../../domain/core/event-filters';

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
      .leftJoin('event.ventureDetail', 'venture_detail')
      .leftJoin('venture_detail.venture', 'venture')
      .leftJoin('venture.ownerDetail', 'owner_detail')
      .leftJoin('owner_detail.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('event.id = :eventId', { eventId })
      .getOne()
      .then((res) => res !== undefined);
  }

  findById(id: string): Promise<VentureEvent | null> {
    return this.eventsRepository
      .findOneBy({ id })
      .then((event) => event as VentureEvent | null);
  }

  deleteById(id: string): Promise<void> {
    return this.eventsRepository.delete({ id }).then((r) => {
      this.logger.log(`VentureEvent deleted: ${id} --> ${r.affected}`);
    });
  }

  // findBySlug(slug: string): Promise<VentureEvent | null> {
  //   return this.eventsRepository
  //     .findOneBy({ slug })
  //     .then((event) => event as VentureEvent | null);
  // }

  save(event: VentureEvent): Promise<VentureEvent> {
    console.log({ toSave: event });
    return this.eventsRepository
      .save(event)
      .then((result) => result as VentureEvent);
  }

  // existsBySlug(slug: string): Promise<boolean> {
  //   return this.eventsRepository.existsBy({ slug });
  // }

  findAllByCriteria(
    filters: EventFilters,
    pagination: Pagination,
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

    if (search) {
      query.andWhere(
        '(event.name LIKE :term OR event.description LIKE :term OR event.slug LIKE :term)',
        { term: `%${search}%` },
      );
    }
    if (categoriesIds) {
      query
        .innerJoin('event.categories', 'category')
        .andWhere('category.id IN (:...ids)', { ids: categoriesIds });
    }

    query.skip(pagination.skip).take(pagination.take);

    return query.getManyAndCount().then(([items, total]) => ({
      items: JSON.parse(JSON.stringify(items)) as VentureEvent[],
      total,
    }));
  }
}
