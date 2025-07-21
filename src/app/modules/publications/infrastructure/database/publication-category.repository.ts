import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginatedBody, PublicationCategory } from 'echadospalante-domain';
import { PublicationCategoryData } from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { In, Repository } from 'typeorm';

import { PublicationCategoriesRepository } from '../../domain/gateway/database/publication-categories.repository';
import { PublicationCategoryStats } from '../../domain/core/publication-category-stats';

@Injectable()
export class PublicationCategoriesRepositoryImpl
  implements PublicationCategoriesRepository
{
  private readonly logger: Logger = new Logger(
    PublicationCategoriesRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(PublicationCategoryData)
    private publicationCategoryRepository: Repository<PublicationCategoryData>,
  ) {}

  public findCategoriesStats(): Promise<
    PaginatedBody<PublicationCategoryStats>
  > {
    const query = this.publicationCategoryRepository.createQueryBuilder(
      'publicationCategory',
    );

    const selectQuery = query
      .select([
        'publicationCategory.id as eventCategory_id',
        'publicationCategory.name as eventCategory_name',
        'publicationCategory.slug as eventCategory_slug',
        'COUNT(publications.id) AS publicationsCount',
      ])
      .leftJoin('publicationCategory.publications', 'publications')
      .groupBy('publicationCategory.id')
      .addGroupBy('publicationCategory.name')
      .addGroupBy('publicationCategory.slug');

    return selectQuery.getRawMany().then((rawResults) => {
      console.log(rawResults);
      const categoriesStats: PublicationCategoryStats[] = rawResults.map(
        (raw) => ({
          id: raw.eventcategory_id,
          name: raw.eventcategory_name,
          slug: raw.eventcategory_slug,
          publicationsCount: parseInt(raw.publicationscount, 10),
        }),
      );

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
    return this.publicationCategoryRepository
      .save({ ...category, id })
      .then(() => undefined);
  }

  findById(id: string): Promise<PublicationCategory | null> {
    return this.publicationCategoryRepository
      .findOneBy({ id })
      .then((event) => event as PublicationCategory | null);
  }

  save(category: {
    name: string;
    slug: string;
    description: string;
  }): Promise<PublicationCategory> {
    const categoryDB = this.publicationCategoryRepository.create({
      ...category,
    });
    return this.publicationCategoryRepository
      .save(categoryDB)
      .then((result) => {
        return JSON.parse(JSON.stringify(result)) as PublicationCategory;
      });
  }

  public findAllByCriteria(search?: string) {
    const query =
      this.publicationCategoryRepository.createQueryBuilder('eventCategory');

    if (search) {
      query.andWhere(
        '(eventCategory.name LIKE :term OR eventCategory.description LIKE :term)',
        { term: `%${search}%` },
      );
    }

    console.log(query.getSql());

    return query.getManyAndCount().then(
      ([items, total]) =>
        ({
          items: JSON.parse(JSON.stringify(items)) as PublicationCategory[],
          total,
        }) as { items: PublicationCategory[]; total: number },
    );
  }

  existsBySlug(slug: string): Promise<boolean> {
    return this.publicationCategoryRepository.exists({ where: { slug } });
  }

  findManyByName(names: string[]): Promise<PublicationCategory[]> {
    return this.publicationCategoryRepository
      .find({
        where: { id: In(names) },
      })
      .then(
        (categories) =>
          JSON.parse(JSON.stringify(categories)) as PublicationCategory[],
      );
  }

  findManyById(ids: string[]): Promise<PublicationCategory[]> {
    return this.publicationCategoryRepository
      .find({
        where: { id: In(ids) },
      })
      .then(
        (categories) =>
          JSON.parse(JSON.stringify(categories)) as PublicationCategory[],
      );
  }

  findByName(name: string): Promise<PublicationCategory | null> {
    return this.publicationCategoryRepository
      .findOneBy({ name })
      .then(
        (category) =>
          JSON.parse(JSON.stringify(category)) as PublicationCategory,
      );
  }

  findAll(): Promise<PublicationCategory[]> {
    return this.publicationCategoryRepository
      .find()
      .then(
        (categories) =>
          JSON.parse(JSON.stringify(categories)) as PublicationCategory[],
      );
  }
}
