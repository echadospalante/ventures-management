import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PaginatedBody,
  VentureCategory,
  VentureCategoryStats,
} from 'echadospalante-domain';
import { VentureCategoryData } from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { In, Repository } from 'typeorm';

import { VentureCategoryFilters } from '../../domain/core/venture-category-filter';
import { VentureCategoriesRepository } from '../../domain/gateway/database/venture-categories.repository';

@Injectable()
export class VentureCategoriesRepositoryImpl
  implements VentureCategoriesRepository
{
  private readonly logger: Logger = new Logger(
    VentureCategoriesRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(VentureCategoryData)
    private ventureCategoryRepository: Repository<VentureCategoryData>,
  ) {}

  findCategoriesStats(
    filters: VentureCategoryFilters,
  ): Promise<PaginatedBody<VentureCategoryStats>> {
    const query =
      this.ventureCategoryRepository.createQueryBuilder('ventureCategory');

    const selectQuery = query
      .select([
        'ventureCategory.id',
        'ventureCategory.name',
        'ventureCategory.slug',
        'COUNT(ventures.id) AS venturesCount',
      ])
      .leftJoin('ventureCategory.ventures', 'ventures')
      .groupBy('ventureCategory.id')
      .addGroupBy('ventureCategory.name')
      .addGroupBy('ventureCategory.slug');

    return selectQuery.getRawMany().then((rawResults) => {
      const categoriesStats: VentureCategoryStats[] = rawResults.map((raw) => ({
        id: raw.ventureCategory_id,
        name: raw.ventureCategory_name,
        slug: raw.ventureCategory_slug,
        venturesCount: parseInt(raw.venturescount, 10),
      }));

      return {
        items: categoriesStats,
        total: categoriesStats.length,
      };
    });
  }

  update(
    id: string,
    category: { name: string; slug: string; description: string },
  ): Promise<void> {
    return this.ventureCategoryRepository
      .save({ ...category, id })
      .then(() => undefined);
  }

  findById(id: string): Promise<VentureCategory | null> {
    return this.ventureCategoryRepository
      .findOneBy({ id })
      .then((venture) => venture as VentureCategory | null);
  }

  save(category: {
    name: string;
    slug: string;
    description: string;
  }): Promise<VentureCategory> {
    const categoryDB = this.ventureCategoryRepository.create({ ...category });
    return this.ventureCategoryRepository.save(categoryDB).then((result) => {
      return result as VentureCategory;
    });
  }

  public findAllByCriteria(
    filters: VentureCategoryFilters,
  ): Promise<PaginatedBody<VentureCategory>> {
    const { search } = filters;

    const query =
      this.ventureCategoryRepository.createQueryBuilder('ventureCategory');

    if (search) {
      query.andWhere(
        '(ventureCategory.name LIKE :term OR ventureCategory.description LIKE :term)',
        { term: `%${search}%` },
      );
    }

    console.log(query.getSql());

    return query.getManyAndCount().then(([categories, total]) => ({
      items: categories as VentureCategory[],
      total,
    }));
  }

  existsBySlug(slug: string): Promise<boolean> {
    return this.ventureCategoryRepository.exists({ where: { slug } });
  }

  findManyByName(names: string[]): Promise<VentureCategory[]> {
    return this.ventureCategoryRepository
      .find({
        where: { id: In(names) },
      })
      .then((categories) => categories as VentureCategory[]);
  }

  findManyById(ids: string[]): Promise<VentureCategory[]> {
    return this.ventureCategoryRepository
      .find({
        where: { id: In(ids) },
      })
      .then((categories) => categories as VentureCategory[]);
  }

  findByName(name: string): Promise<VentureCategory | null> {
    return this.ventureCategoryRepository
      .findOneBy({ name })
      .then((category) => category as VentureCategory);
  }

  findAll(): Promise<VentureCategory[]> {
    return this.ventureCategoryRepository
      .find()
      .then((categories) => categories as VentureCategory[]);
  }
}
