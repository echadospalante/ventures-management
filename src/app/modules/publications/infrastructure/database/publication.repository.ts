import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Pagination, VenturePublication } from 'echadospalante-core';
import {
  VentureData,
  VenturePublicationData,
} from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';

import { PublicationFilters } from '../../domain/core/publication-filters';
import { PublicationsRepository } from '../../domain/gateway/database/publications.repository';

@Injectable()
export class PublicationsRepositoryImpl implements PublicationsRepository {
  private readonly logger = new Logger(PublicationsRepositoryImpl.name);
  public constructor(
    @InjectRepository(VenturePublicationData)
    private publicationsRepository: Repository<VenturePublicationData>,
  ) {}

  public isPublicationOwnerById(eventId: string, userId: string): unknown {
    return this.publicationsRepository
      .createQueryBuilder('publication')
      .leftJoin('publication.venture', 'venture')
      .leftJoin('venture.owner', 'owner')
      .leftJoin('owner.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('publication.id = :eventId', { eventId })
      .getOne()
      .then((res) => res !== undefined);
  }

  public findById(id: string): Promise<VenturePublication | null> {
    return this.publicationsRepository
      .findOneBy({ id })
      .then((event) => event as VenturePublication | null);
  }

  public deleteById(id: string): Promise<void> {
    return this.publicationsRepository.delete({ id }).then((r) => {
      this.logger.log(`VenturePublication deleted: ${id} --> ${r.affected}`);
    });
  }

  // findBySlug(slug: string): Promise<VenturePublication | null> {
  //   return this.eventsRepository
  //     .findOneBy({ slug })
  //     .then((event) => event as VenturePublication | null);
  // }

  public save(
    event: VenturePublication,
    ventureId: string,
  ): Promise<VenturePublication> {
    return this.publicationsRepository
      .save({ ...event, venture: { id: ventureId } as VentureData })
      .then(
        (result) => JSON.parse(JSON.stringify(result)) as VenturePublication,
      );
  }

  // existsBySlug(slug: string): Promise<boolean> {
  //   return this.eventsRepository.existsBy({ slug });
  // }

  public findAllByCriteria(
    filters: PublicationFilters,
    pagination: Pagination,
    ventureId?: string,
  ): Promise<{ items: VenturePublication[]; total: number }> {
    const {
      search,
      categoriesIds,
      // departmentId,
      // municipalityId,
      // point,
      // radius,
    } = filters;

    const query = this.publicationsRepository.createQueryBuilder('event');

    query
      .leftJoinAndSelect('event.categories', 'category')
      .leftJoinAndSelect('event.contents', 'contents');

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
        items: JSON.parse(JSON.stringify(items)) as VenturePublication[],
        total,
      };
    });
  }
}
