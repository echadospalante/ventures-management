import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Pagination, VenturePublication } from 'echadospalante-domain';
import {
  VentureData,
  VenturePublicationData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';

import { PublicationFilters } from '../../domain/core/publication-filters';
import { PublicationsRepository } from '../../domain/gateway/database/publications.repository';

@Injectable()
export class PublicationsRepositoryImpl implements PublicationsRepository {
  private readonly logger = new Logger(PublicationsRepositoryImpl.name);
  public constructor(
    @InjectRepository(VenturePublicationData)
    private publicationsRepository: Repository<VenturePublicationData>,
  ) {}

  public findSorted(
    filters: PublicationFilters,
    pagination: Pagination,
    sortBy: 'createdAt' | 'reactions',
  ): Promise<VenturePublication[]> {
    const query = this.publicationsRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.venture', 'venture')
      .leftJoinAndSelect('publication.categories', 'categories')
      .leftJoinAndSelect('publication.contents', 'contents');

    if (filters.search) {
      query.andWhere(
        '(publication.description LIKE :term OR contents.content LIKE :term)',
        { term: `%${filters.search}%` },
      );
    }

    if (filters.categoriesIds?.length) {
      query.andWhere('categories.id IN (:...ids)', {
        ids: filters.categoriesIds,
      });
    }

    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      query.andWhere('publication.createdAt BETWEEN :from AND :to', {
        from: new Date(from),
        to: new Date(to),
      });
    }

    query.skip(pagination.skip).take(pagination.take);

    if (sortBy === 'createdAt') {
      query.orderBy('publication.createdAt', 'DESC');
    } else if (sortBy === 'reactions') {
      query.orderBy('publication.clapsCount', 'DESC');
    }

    return query.getMany().then((items) => {
      return items.map((item) =>
        JSON.parse(JSON.stringify(item)),
      ) as VenturePublication[];
    });
  }

  public existsById(publicationId: string): Promise<boolean> {
    return this.publicationsRepository.existsBy({ id: publicationId });
  }

  public findRandomPublication(): Promise<VenturePublication | null> {
    return this.publicationsRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.venture', 'venture')
      .leftJoinAndSelect('publication.categories', 'categories')
      .leftJoinAndSelect('publication.contents', 'contents')
      .orderBy('RANDOM()')
      .limit(1)
      .getOne()
      .then((publication) => {
        return publication as VenturePublication | null;
      });
  }

  public isPublicationOwnerById(
    publicationsId: string,
    userId: string,
  ): unknown {
    return this.publicationsRepository
      .createQueryBuilder('publication')
      .leftJoin('publication.venture', 'venture')
      .leftJoin('venture.owner', 'owner')
      .leftJoin('owner.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('publication.id = :publicationsId', { publicationsId })
      .getOne()
      .then((res) => res !== undefined);
  }

  public findById(id: string): Promise<VenturePublication | null> {
    return this.publicationsRepository
      .findOneBy({ id })
      .then((publications) => publications as VenturePublication | null);
  }

  public deleteById(id: string): Promise<void> {
    return this.publicationsRepository.delete({ id }).then((r) => {
      this.logger.log(`VenturePublication deleted: ${id} --> ${r.affected}`);
    });
  }

  // findBySlug(slug: string): Promise<VenturePublication | null> {
  //   return this.publicationssRepository
  //     .findOneBy({ slug })
  //     .then((publications) => publications as VenturePublication | null);
  // }

  public save(
    publication: VenturePublication,
    ventureId: string,
  ): Promise<VenturePublication> {
    return this.publicationsRepository
      .save({ ...publication, venture: { id: ventureId } as VentureData })
      .then(
        (result) => JSON.parse(JSON.stringify(result)) as VenturePublication,
      );
  }

  public findAllByCriteria(
    filters: PublicationFilters,
    pagination: Pagination,
    ventureSlug?: string,
  ): Promise<{ items: VenturePublication[]; total: number }> {
    const { search, categoriesIds, dateRange } = filters;

    const query =
      this.publicationsRepository.createQueryBuilder('publications');

    query
      .leftJoinAndSelect('publications.categories', 'category')
      .leftJoinAndSelect('publications.contents', 'contents')
      .leftJoinAndSelect('publications.venture', 'venture');

    if (search) {
      query.andWhere(
        '(publications.description LIKE :term OR contents.content LIKE :term)',
        { term: `%${search}%` },
      );
    }
    if (ventureSlug) {
      query.andWhere('venture.slug = :ventureSlug', {
        ventureSlug,
      });
    }

    if (dateRange) {
      const { from, to } = dateRange;
      query.andWhere('publications.createdAt BETWEEN :from AND :to', {
        from: new Date(from),
        to: new Date(to),
      });
    }

    if (categoriesIds?.length) {
      query.andWhere('category.id IN (:...ids)', { ids: categoriesIds });
    }

    query.skip(pagination.skip).take(pagination.take);

    return query.getManyAndCount().then(([items, total]) => {
      return {
        items: JSON.parse(JSON.stringify(items)) as VenturePublication[],
        total,
      };
    });
  }

  public countByUserEmail(email: string): Promise<number> {
    const query = this.publicationsRepository
      .createQueryBuilder('publication')
      .leftJoin('publication.venture', 'venture')
      .leftJoin('venture.owner', 'owner')
      .where('owner.email = :email', { email });

    return query.getCount();
  }
}
