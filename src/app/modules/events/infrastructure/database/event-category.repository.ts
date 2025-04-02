import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EventCategory } from 'echadospalante-core';
import { EventCategoryData } from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';
import { In, Repository } from 'typeorm';

import { EventCategoryFilters } from '../../domain/core/event-category-filter';
import { EventCategoriesRepository } from '../../domain/gateway/database/event-categories.repository';

@Injectable()
export class EventCategoriesRepositoryImpl
  implements EventCategoriesRepository
{
  private readonly logger: Logger = new Logger(
    EventCategoriesRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(EventCategoryData)
    private eventCategoryRepository: Repository<EventCategoryData>,
  ) {}

  update(
    id: string,
    category: { name: string; slug: string; description: string },
  ): Promise<void> {
    return this.eventCategoryRepository
      .save({ ...category, id })
      .then(() => undefined);
  }

  findById(id: string): Promise<EventCategory | null> {
    return this.eventCategoryRepository
      .findOneBy({ id })
      .then((event) => event as EventCategory | null);
  }

  save(category: {
    name: string;
    slug: string;
    description: string;
  }): Promise<EventCategory> {
    const categoryDB = this.eventCategoryRepository.create({ ...category });
    return this.eventCategoryRepository.save(categoryDB).then((result) => {
      return result as EventCategory;
    });
  }

  count(filters: EventCategoryFilters): Promise<number> {
    const { search } = filters;

    return this.eventCategoryRepository.count({
      where: {
        name: search,
      },
    });
  }

  findAllByCriteria(filters: EventCategoryFilters): Promise<EventCategory[]> {
    const { search } = filters;

    const query =
      this.eventCategoryRepository.createQueryBuilder('eventCategory');

    if (search) {
      query.andWhere(
        '(eventCategory.name LIKE :term OR eventCategory.description LIKE :term)',
        { term: `%${search}%` },
      );
    }

    console.log(query.getSql());

    return query.getMany().then((categories) => categories as EventCategory[]);
  }

  existsBySlug(slug: string): Promise<boolean> {
    return this.eventCategoryRepository.exists({ where: { slug } });
  }

  findManyByName(names: string[]): Promise<EventCategory[]> {
    return this.eventCategoryRepository
      .find({
        where: { id: In(names) },
      })
      .then((categories) => categories as EventCategory[]);
  }

  findManyById(ids: string[]): Promise<EventCategory[]> {
    return this.eventCategoryRepository
      .find({
        where: { id: In(ids) },
      })
      .then((categories) => categories as EventCategory[]);
  }

  findByName(name: string): Promise<EventCategory | null> {
    return this.eventCategoryRepository
      .findOneBy({ name })
      .then((category) => category as EventCategory);
  }

  findAll(): Promise<EventCategory[]> {
    return this.eventCategoryRepository
      .find()
      .then((categories) => categories as EventCategory[]);
  }
}
