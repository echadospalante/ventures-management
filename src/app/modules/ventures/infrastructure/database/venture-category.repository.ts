import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { VentureCategory } from 'echadospalante-core';
import { VentureCategoryData } from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';
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

  count(filters: VentureCategoryFilters): Promise<number> {
    const { search } = filters;

    return this.ventureCategoryRepository.count({
      where: {
        name: search,
      },
    });
  }

  findAllByCriteria(
    filters: VentureCategoryFilters,
  ): Promise<VentureCategory[]> {
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

    return query
      .getMany()
      .then((categories) => categories as VentureCategory[]);
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
