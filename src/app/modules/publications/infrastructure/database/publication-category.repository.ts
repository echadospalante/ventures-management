import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PublicationCategory } from 'echadospalante-core';
import { PublicationCategoryData } from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';
import { In, Repository } from 'typeorm';

import { PublicationCategoriesRepository } from '../../domain/gateway/database/publication-categories.repository';

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
