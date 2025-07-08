import { Pagination, VentureSubscription } from 'echadospalante-domain';

export interface VentureSubscriptionsRepository {
  exists(ventureId: string, requesterEmail: string): Promise<boolean>;
  findById(subscriptionId: string): Promise<VentureSubscription | null>;
  findByVentureAndUser(
    ventureId: string,
    subscriberId: string,
  ): Promise<VentureSubscription | null>;
  delete(ventureId: string, subscriptionId: string): Promise<boolean>;
  save(ventureId: string, subscriberId: string): Promise<VentureSubscription>;
  findPaginated(
    ventureId: string,
    pagination: Pagination,
  ): Promise<{ items: VentureSubscription[]; total: number }>;
}

export const VentureSubscriptionsRepository = Symbol(
  'VentureSubscriptionsRepository',
);
