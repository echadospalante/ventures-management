import { ComplexInclude, VentureCategory } from 'echadospalante-core';

export interface VentureCategoriesRepository {
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
