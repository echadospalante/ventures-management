import { VentureCategory } from 'echadospalante-domain';

import { VentureCategoryFilters } from '../../core/venture-category-filter';
import { VentureFilters } from '../../core/venture-filters';

export interface VentureCategoriesRepository {
  update(
    id: string,
    category: { name: string; slug: string; description: string },
  ): Promise<void>;
  findById(id: string): Promise<VentureCategory | null>;
  count(filters: VentureFilters): Promise<number>;
  findAllByCriteria(
    filters: VentureCategoryFilters,
  ): Promise<VentureCategory[]>;

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
