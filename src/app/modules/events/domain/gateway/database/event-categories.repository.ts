import { EventCategory, PaginatedBody } from 'echadospalante-domain';

import { EventCategoryFilters } from '../../core/event-category-filter';
import { EventCategoryStats } from '../../core/event-category-stats';

export interface EventCategoriesRepository {
  findCategoriesStats(
    filters: EventCategoryFilters,
  ): Promise<PaginatedBody<EventCategoryStats>>;
  update(
    id: string,
    category: { name: string; slug: string; description: string },
  ): Promise<void>;
  findById(id: string): Promise<EventCategory | null>;
  count(filters: EventCategoryFilters): Promise<number>;
  findAllByCriteria(filters: EventCategoryFilters): Promise<EventCategory[]>;

  existsBySlug(name: string): Promise<boolean>;
  save(category: {
    name: string;
    slug: string;
    description: string;
  }): Promise<EventCategory>;
  findManyByName(names: string[]): Promise<EventCategory[]>;
  findManyById(id: string[]): Promise<EventCategory[]>;
  findByName(name: string): Promise<EventCategory | null>;
  findAll(): Promise<EventCategory[]>;
}

export const EventCategoriesRepository = Symbol('EventCategoriesRepository');
