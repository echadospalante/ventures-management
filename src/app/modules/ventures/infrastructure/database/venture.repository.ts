import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { VentureData } from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';

import { VenturesRepository } from '../../domain/gateway/database/ventures.repository';
import { Venture, Pagination, VentureStats } from 'echadospalante-domain';
import { VentureFilters } from '../../domain/core/venture-filters';

@Injectable()
export class VenturesRepositoryImpl implements VenturesRepository {
  private readonly logger = new Logger(VenturesRepositoryImpl.name);
  public constructor(
    @InjectRepository(VentureData)
    private venturesRepository: Repository<VentureData>,
  ) {}

  public countByUserEmail(email: string): Promise<number> {
    return this.venturesRepository.count({
      where: { owner: { email } },
    });
  }

  public getVenturesStats(ventureId: string): Promise<VentureStats> {
    const query = this.venturesRepository
      .createQueryBuilder('venture')
      .select([
        'COUNT(DISTINCT publication.id) AS publicationsCount',
        'COUNT(DISTINCT event.id) AS eventsCount',
        'COALESCE(SUM(publication.commentsCount), 0) AS commentsCount',
        'COALESCE(SUM(publication.clapsCount), 0) AS clapsCount',
      ])
      .leftJoin('venture.publications', 'publication')
      .leftJoin('venture.events', 'event')
      .where('venture.id = :ventureId', { ventureId });

    return query.getRawOne().then((result) => {
      if (!result) {
        return {
          publicationsCount: 0,
          eventsCount: 0,
          commentsCount: 0,
          clapsCount: 0,
        };
      }

      return {
        publicationsCount: parseInt(result.publicationscount, 10) || 0,
        eventsCount: parseInt(result.eventscount, 10) || 0,
        commentsCount: parseInt(result.commentscount, 10) || 0,
        clapsCount: parseInt(result.clapscount, 10) || 0,
      } as VentureStats;
    });
  }

  public findRandomVenture(): Promise<Venture | null> {
    return this.venturesRepository
      .createQueryBuilder('venture')
      .leftJoinAndSelect('venture.categories', 'category')
      .leftJoinAndSelect('venture.location', 'location')
      .leftJoinAndSelect('venture.owner', 'owner')
      .orderBy('RANDOM()')
      .limit(1)
      .getOne()
      .then((venture) => venture as Venture | null);
  }

  public isVentureOwner(
    ventureId: string,
    requesterEmail: string,
  ): Promise<boolean> {
    return this.venturesRepository
      .createQueryBuilder('venture')
      .leftJoin('venture.owner', 'user')
      .where('user.email = :requesterEmail', { requesterEmail })
      .andWhere('venture.id = :ventureId', { ventureId })
      .getOne()
      .then((res) => !!res);
  }

  findById(id: string): Promise<Venture | null> {
    return this.venturesRepository
      .findOne({
        where: { id },
        relations: [
          'categories',
          'contact',
          'location',
          'owner',
          // 'events',
          // 'sponsorships',
          // 'subscriptions',
          // 'publications',
        ],
      })
      .then((venture) => venture as Venture | null);
  }

  deleteById(id: string): Promise<void> {
    return this.venturesRepository.delete({ id }).then((r) => {
      this.logger.log(`Venture deleted: ${id} --> ${r.affected}`);
    });
  }

  findBySlug(slug: string): Promise<Venture | null> {
    return this.venturesRepository
      .findOne({
        where: { slug },
        relations: [
          'categories',
          'contact',
          'location',
          'owner',
          // 'sponsorships',
          // 'subscriptions',
          // 'events',
          // 'publications',
        ],
      })
      .then((venture) => venture as Venture | null);
  }

  public save(venture: Venture): Promise<Venture> {
    return this.venturesRepository
      .save(venture)
      .then((result) => result as Venture);
  }

  existsBySlug(slug: string): Promise<boolean> {
    return this.venturesRepository.existsBy({ slug });
  }

  findAllByCriteria(
    filters: VentureFilters,
    pagination?: Pagination,
  ): Promise<{ items: Venture[]; total: number }> {
    const { search, categoriesIds, ownerEmail, municipalitiesIds } = filters;

    const query = this.venturesRepository.createQueryBuilder('venture');

    query
      .leftJoinAndSelect('venture.categories', 'category')
      .leftJoinAndSelect('venture.location', 'location')
      .leftJoinAndSelect('venture.owner', 'owner');

    console.log({
      ownerEmail,
    });

    if (ownerEmail) {
      query.andWhere('owner.email = :ownerEmail', { ownerEmail });
    }

    // MunicipalitiesIds has mandatory length 1

    const municipalityId = municipalitiesIds[0];

    // query.andWhere('location.municipalityId = :municipalityId', {
    //   municipalityId,
    // });

    if (search) {
      query.andWhere(
        '(venture.name LIKE :term OR venture.description LIKE :term OR venture.slug LIKE :term)',
        { term: `%${search}%` },
      );
    }
    if (categoriesIds) {
      query.andWhere('category.id IN (:...ids)', { ids: categoriesIds });
    }

    if (pagination) {
      query.skip(pagination.skip).take(pagination.take);
    }

    return query.getManyAndCount().then(([items, total]) => ({
      items: items as Venture[],
      total,
    }));
  }

  isVentureOwnerByEmail(ventureId: string, email: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
