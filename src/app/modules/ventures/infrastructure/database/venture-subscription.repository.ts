import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Pagination, VentureSubscription } from 'echadospalante-domain';
import {
  UserData,
  VentureData,
  VentureSubscriptionData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { Repository } from 'typeorm';

import { VentureSubscriptionsRepository } from '../../domain/gateway/database/venture-subscriptions.repository';

@Injectable()
export class VentureSubscriptionsRepositoryImpl
  implements VentureSubscriptionsRepository
{
  private readonly logger = new Logger(VentureSubscriptionsRepositoryImpl.name);

  public constructor(
    @InjectRepository(VentureSubscriptionData)
    private subscriptionsRepository: Repository<VentureSubscriptionData>,
  ) {}

  public delete(ventureId: string, subscriberId: string): Promise<boolean> {
    return this.subscriptionsRepository
      .delete({ ventureId, subscriberId })
      .then(
        (result) =>
          result.affected !== undefined &&
          result.affected !== null &&
          result.affected > 0,
      );
  }

  public save(
    ventureId: string,
    subscriberId: string,
  ): Promise<VentureSubscription> {
    return this.subscriptionsRepository
      .save({
        venture: { id: ventureId } as VentureData,
        subscriber: { id: subscriberId } as UserData,
      })
      .then(
        (result) => JSON.parse(JSON.stringify(result)) as VentureSubscription,
      );
  }

  public findPaginated(
    ventureId: string,
    pagination: Pagination,
  ): Promise<{ items: VentureSubscription[]; total: number }> {
    const query =
      this.subscriptionsRepository.createQueryBuilder('subscription');

    query.skip(pagination.skip).take(pagination.take);

    return query
      .leftJoin('subscription.venture', 'venture')
      .leftJoinAndSelect('subscription.subscriber', 'subscriber')
      .where('venture.id = :ventureId', { ventureId })
      .getManyAndCount()
      .then(([subscriptions, total]) => ({
        items: subscriptions as VentureSubscription[],
        total,
      }));
  }
}
