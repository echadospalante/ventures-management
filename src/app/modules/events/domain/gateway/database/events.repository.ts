import { Pagination, VentureEvent } from 'echadospalante-core';
import { EventFilters } from '../../core/event-filters';

export interface EventsRepository {
  existsBySlug(slug: string): Promise<boolean>;
  isEventOwnerById(eventId: string, email: string): Promise<boolean>;
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
