import {
  PaginatedBody,
  Pagination,
  VentureCategory,
  VentureSubscription,
} from 'echadospalante-domain';

export interface VentureSubscriptionsRepository {
  getSubscribersCountByUserEmail(email: string): Promise<number>;
  countByUserEmail(email: string): Promise<number>;
  findOwnedSubscriptions(
    ventureCategoryId: string,
    requesterEmail: string,
    pagination: Pagination,
  ): Promise<PaginatedBody<VentureSubscription>>;
  getOwnedSubscriptionsStats(
    requesterEmail: string,
  ): Promise<{ category: VentureCategory; total: number }[]>;
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
