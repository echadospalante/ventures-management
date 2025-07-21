import { PaginatedBody, PublicationCategory } from 'echadospalante-domain';
import { PublicationCategoryStats } from '../../core/publication-category-stats';

export interface PublicationCategoriesRepository {
  findCategoriesStats(): Promise<PaginatedBody<PublicationCategoryStats>>;
  update(
    id: string,
    category: { name: string; slug: string; description: string },
  ): Promise<void>;
  findById(id: string): Promise<PublicationCategory | null>;
  findAllByCriteria(
    search?: string,
  ): Promise<{ items: PublicationCategory[]; total: number }>;
  existsBySlug(name: string): Promise<boolean>;
  save(category: {
    name: string;
    slug: string;
    description: string;
  }): Promise<PublicationCategory>;
  findManyByName(names: string[]): Promise<PublicationCategory[]>;
  findManyById(id: string[]): Promise<PublicationCategory[]>;
  findByName(name: string): Promise<PublicationCategory | null>;
  findAll(): Promise<PublicationCategory[]>;
}

export const PublicationCategoriesRepository = Symbol(
  'PublicationCategoriesRepository',
);
