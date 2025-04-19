import { Pagination, VentureSubscription } from 'echadospalante-core';

export interface SubscriptionsRepository {
  save(ventureId: string, subscriberId: string): Promise<VentureSubscription>;
  findPaginated(
    ventureId: string,
    pagination: Pagination,
  ): Promise<{ items: VentureSubscription[]; total: number }>;
}

export const SubscriptionsRepository = Symbol('SubscriptionsRepository');
