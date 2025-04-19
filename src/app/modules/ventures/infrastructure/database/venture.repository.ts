import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { VentureData } from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';

import { VenturesRepository } from '../../domain/gateway/database/ventures.repository';
import { Venture, Pagination } from 'echadospalante-core';
import {
  OwnedVentureFilters,
  VentureFilters,
} from '../../domain/core/venture-filters';

@Injectable()
export class VenturesRepositoryImpl implements VenturesRepository {
  private readonly logger = new Logger(VenturesRepositoryImpl.name);
  public constructor(
    @InjectRepository(VentureData)
    private venturesRepository: Repository<VentureData>,
  ) {}

  findById(id: string): Promise<Venture | null> {
    return this.venturesRepository
      .findOneBy({ id })
      .then((venture) => venture as Venture | null);
  }

  deleteById(id: string): Promise<void> {
    return this.venturesRepository.delete({ id }).then((r) => {
      this.logger.log(`Venture deleted: ${id} --> ${r.affected}`);
    });
  }

  findBySlug(slug: string): Promise<Venture | null> {
    return this.venturesRepository
      .findOneBy({ slug })
      .then((venture) => venture as Venture | null);
  }

  save(venture: Venture): Promise<Venture> {
    return this.venturesRepository
      .save(venture)
      .then((result) => result as Venture);
  }

  existsBySlug(slug: string): Promise<boolean> {
    return this.venturesRepository.existsBy({ slug });
  }

  findAllByCriteria(
    filters: VentureFilters,
    pagination: Pagination,
  ): Promise<{ items: Venture[]; total: number }> {
    const {
      search,
      categoriesIds,
      // departmentId,
      // municipalityId,
      // point,
      // radius,
    } = filters;

    const query = this.venturesRepository.createQueryBuilder('venture');

    if (search) {
      query.andWhere(
        '(venture.name LIKE :term OR venture.description LIKE :term OR venture.slug LIKE :term)',
        { term: `%${search}%` },
      );
    }
    if (categoriesIds) {
      query
        .innerJoin('venture.categories', 'category')
        .andWhere('category.id IN (:...ids)', { ids: categoriesIds });
    }

    query.skip(pagination.skip).take(pagination.take);

    return query
      .getManyAndCount()
      .then(([items, total]) => ({ items: items as Venture[], total }));
  }

  findOwnedVentures(
    filters: OwnedVentureFilters,
    pagination?: Pagination,
  ): Promise<Venture[]> {
    throw new Error('Method not implemented.');
  }

  isVentureOwnerByEmail(ventureId: string, email: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  countOwnedVentures(filters: OwnedVentureFilters): Promise<number> {
    throw new Error('Method not implemented.');
  }

  countByCriteria(filter: VentureFilters): Promise<number> {
    return Promise.resolve(1);
  }
}
