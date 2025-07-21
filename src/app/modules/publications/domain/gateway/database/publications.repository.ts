import { Pagination, VenturePublication } from 'echadospalante-domain';
import { PublicationFilters } from '../../core/publication-filters';

export interface PublicationsRepository {
  countByUserEmail(email: string): Promise<number>;
  findSorted(
    filters: PublicationFilters,
    pagination: Pagination,
    sortBy: 'createdAt' | 'reactions',
  ): Promise<VenturePublication[]>;
  existsById(publicationId: string): Promise<boolean>;
  findRandomPublication(): Promise<VenturePublication | null>;
  isPublicationOwnerById(eventId: string, email: string): unknown;
  findById(id: string): Promise<VenturePublication | null>;
  deleteById(id: string): Promise<void>;
  save(
    publication: VenturePublication,
    ventureId: string,
  ): Promise<VenturePublication>;
  findAllByCriteria(
    filters: any,
    pagination: Pagination,
    ventureId?: string,
  ): Promise<{ items: VenturePublication[]; total: number }>;
}

export const PublicationsRepository = Symbol('PublicationsRepository');
