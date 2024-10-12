import {
  ComplexInclude,
  Pagination,
  VentureCategory,
} from 'echadospalante-core';
import { VentureCategoryFilters } from '../../core/venture-category-filter';
import { VentureFilters } from '../../core/venture-filters';

export interface VentureCategoriesRepository {
  count(filters: VentureFilters): Promise<number>;
  findAllByCriteria(
    filters: VentureCategoryFilters,
    include: { ventures: boolean; users: boolean },
    pagination: Pagination,
  ): Promise<VentureCategory[]>;

  existsBySlug(name: string): Promise<boolean>;
  save(
    category: { name: string; slug: string; description: string },
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory>;
  findManyByName(
    names: string[],
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory[]>;
  findManyById(
    id: string[],
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory[]>;
  findByName(
    name: string,
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory | null>;
  findAll(
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory[]>;
}

export const VentureCategoriesRepository = Symbol(
  'VentureCategoriesRepository',
);
