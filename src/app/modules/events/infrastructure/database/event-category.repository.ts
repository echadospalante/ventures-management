import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EventCategory, PaginatedBody } from 'echadospalante-domain';
import { EventCategoryData } from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { In, Repository } from 'typeorm';

import { EventCategoryFilters } from '../../domain/core/event-category-filter';
import { EventCategoryStats } from '../../domain/core/event-category-stats';
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

  public findCategoriesStats(
    filters: EventCategoryFilters,
  ): Promise<PaginatedBody<EventCategoryStats>> {
    const query =
      this.eventCategoryRepository.createQueryBuilder('eventCategory');

    const selectQuery = query
      .select([
        'eventCategory.id',
        'eventCategory.name',
        'eventCategory.slug',
        'COUNT(events.id) AS eventsCount',
      ])
      .leftJoin('eventCategory.events', 'events')
      .groupBy('eventCategory.id')
      .addGroupBy('eventCategory.name')
      .addGroupBy('eventCategory.slug');

    return selectQuery.getRawMany().then((rawResults) => {
      const categoriesStats: EventCategoryStats[] = rawResults.map((raw) => ({
        id: raw.eventCategory_id,
        name: raw.eventCategory_name,
        slug: raw.eventCategory_slug,
        eventsCount: parseInt(raw.eventscount, 10),
      }));

      return {
        items: categoriesStats,
        total: categoriesStats.length,
      };
    });
  }

  public update(
    id: string,
    category: { name: string; slug: string; description: string },
  ): Promise<void> {
    return this.eventCategoryRepository
      .save({ ...category, id })
      .then(() => undefined);
  }

  public findById(id: string): Promise<EventCategory | null> {
    return this.eventCategoryRepository
      .findOneBy({ id })
      .then((event) => event as EventCategory | null);
  }

  public save(category: {
    name: string;
    slug: string;
    description: string;
  }): Promise<EventCategory> {
    const categoryDB = this.eventCategoryRepository.create({ ...category });
    return this.eventCategoryRepository.save(categoryDB).then((result) => {
      return JSON.parse(JSON.stringify(result)) as EventCategory;
    });
  }

  public count(filters: EventCategoryFilters): Promise<number> {
    const { search } = filters;

    return this.eventCategoryRepository.count({
      where: {
        name: search,
      },
    });
  }

  public findAllByCriteria(
    filters: EventCategoryFilters,
  ): Promise<EventCategory[]> {
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

    return query
      .getMany()
      .then(
        (categories) =>
          JSON.parse(JSON.stringify(categories)) as EventCategory[],
      );
  }

  public existsBySlug(slug: string): Promise<boolean> {
    return this.eventCategoryRepository.exists({ where: { slug } });
  }

  public findManyByName(names: string[]): Promise<EventCategory[]> {
    return this.eventCategoryRepository
      .find({
        where: { id: In(names) },
      })
      .then(
        (categories) =>
          JSON.parse(JSON.stringify(categories)) as EventCategory[],
      );
  }

  public findManyById(ids: string[]): Promise<EventCategory[]> {
    return this.eventCategoryRepository
      .find({
        where: { id: In(ids) },
      })
      .then(
        (categories) =>
          JSON.parse(JSON.stringify(categories)) as EventCategory[],
      );
  }

  public findByName(name: string): Promise<EventCategory | null> {
    return this.eventCategoryRepository
      .findOneBy({ name })
      .then(
        (category) => JSON.parse(JSON.stringify(category)) as EventCategory,
      );
  }

  public findAll(): Promise<EventCategory[]> {
    return this.eventCategoryRepository
      .find()
      .then(
        (categories) =>
          JSON.parse(JSON.stringify(categories)) as EventCategory[],
      );
  }
}
