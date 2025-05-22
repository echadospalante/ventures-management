import { Pagination, VenturePublication } from 'echadospalante-domain';

export interface PublicationsRepository {
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
