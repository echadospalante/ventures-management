import { Pagination, VentureSubscription } from 'echadospalante-core';

export interface VentureSubscriptionsRepository {
  delete(ventureId: string, subscriberId: string): Promise<boolean>;
  save(ventureId: string, subscriberId: string): Promise<VentureSubscription>;
  findPaginated(
    ventureId: string,
    pagination: Pagination,
  ): Promise<{ items: VentureSubscription[]; total: number }>;
}

export const VentureSubscriptionsRepository = Symbol(
  'VentureSubscriptionsRepository',
);
