import {
  PaginatedBody,
  VentureCategory,
  VentureCategoryStats,
} from 'echadospalante-domain';

import { VentureCategoryFilters } from '../../core/venture-category-filter';

export interface VentureCategoriesRepository {
  findCategoriesStats(
    filters: VentureCategoryFilters,
  ): Promise<PaginatedBody<VentureCategoryStats>>;
  update(
    id: string,
    category: { name: string; slug: string; description: string },
  ): Promise<void>;
  findById(id: string): Promise<VentureCategory | null>;
  findAllByCriteria(
    filters: VentureCategoryFilters,
  ): Promise<PaginatedBody<VentureCategory>>;
  existsBySlug(name: string): Promise<boolean>;
  save(category: {
    name: string;
    slug: string;
    description: string;
  }): Promise<VentureCategory>;
  findManyByName(names: string[]): Promise<VentureCategory[]>;
  findManyById(id: string[]): Promise<VentureCategory[]>;
  findByName(name: string): Promise<VentureCategory | null>;
  findAll(): Promise<VentureCategory[]>;
}

export const VentureCategoriesRepository = Symbol(
  'VentureCategoriesRepository',
);
