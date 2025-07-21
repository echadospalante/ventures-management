import { Pagination, VentureEvent } from 'echadospalante-domain';
import { EventFilters } from '../../core/event-filters';

export interface EventsRepository {
  countByUserEmail(email: string): Promise<number>;
  existsBySlug(slug: string): Promise<boolean>;
  isEventOwnerById(eventId: string, userId: string): Promise<boolean>;
  findById(id: string): Promise<VentureEvent | null>;
  deleteById(id: string): Promise<void>;
  save(event: VentureEvent, ventureId: string): Promise<VentureEvent>;
  findAllByCriteria(
    filters: EventFilters,
    pagination: Pagination,
    ventureId?: string,
  ): Promise<{ items: VentureEvent[]; total: number }>;
}

export const EventsRepository = Symbol('EventsRepository');
