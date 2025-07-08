import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Pagination, VentureSubscription } from 'echadospalante-domain';
import {
  UserData,
  VentureData,
  VentureSubscriptionData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { DataSource, Repository } from 'typeorm';

import { VentureSubscriptionsRepository } from '../../domain/gateway/database/venture-subscriptions.repository';

@Injectable()
export class VentureSubscriptionsRepositoryImpl
  implements VentureSubscriptionsRepository
{
  private readonly logger = new Logger(VentureSubscriptionsRepositoryImpl.name);

  public constructor(
    @InjectRepository(VentureSubscriptionData)
    private subscriptionsRepository: Repository<VentureSubscriptionData>,
    private dataSource: DataSource,
  ) {}
  public findByVentureAndUser(
    ventureId: string,
    subscriberId: string,
  ): Promise<VentureSubscription | null> {
    return this.subscriptionsRepository
      .findOne({
        where: {
          venture: { id: ventureId } as VentureData,
          subscriber: { id: subscriberId } as UserData,
        },
      })
      .then((subscription) => {
        if (!subscription) {
          return null;
        }
        return JSON.parse(JSON.stringify(subscription)) as VentureSubscription;
      });
  }

  public exists(ventureId: string, requesterEmail: string): Promise<boolean> {
    return this.subscriptionsRepository.exists({
      where: {
        venture: { id: ventureId },
        subscriber: { email: requesterEmail },
      },
    });
  }

  public findById(subscriptionId: string): Promise<VentureSubscription | null> {
    return this.subscriptionsRepository
      .findOne({
        where: { id: subscriptionId },
      })
      .then((subscription) => {
        if (!subscription) {
          return null;
        }
        return JSON.parse(JSON.stringify(subscription)) as VentureSubscription;
      });
  }

  public delete(ventureId: string, subscriptionId: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner
      .connect()
      .then(() => queryRunner.startTransaction())
      .then(() =>
        queryRunner.manager
          .findOne(VentureSubscriptionData, { where: { id: subscriptionId } })
          .then((subscription) => {
            if (!subscription) {
              throw new Error(`Subscripton with id ${subscription} not found`);
            }
            return queryRunner.manager.remove(subscription);
          }),
      )
      .then(() =>
        queryRunner.manager.decrement(
          VentureData,
          { id: ventureId },
          'subscriptionsCount',
          1,
        ),
      )
      .then(() => queryRunner.commitTransaction())
      .then(() => true)
      .catch((error) => {
        this.logger.error('Error deleting clap with transaction', error.stack);
        return queryRunner.rollbackTransaction().then(() => false);
      })
      .finally(() => queryRunner.release());
  }

  public async save(
    ventureId: string,
    subscriberId: string,
  ): Promise<VentureSubscription> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newSubscription = queryRunner.manager.create(
        VentureSubscriptionData,
        {
          venture: { id: ventureId } as VentureData,
          subscriber: { id: subscriberId } as UserData,
        },
      );

      const savedSubscription = await queryRunner.manager.save(newSubscription);

      await queryRunner.manager.increment(
        VentureData,
        { id: ventureId },
        'subscriptionsCount',
        1,
      );

      await queryRunner.commitTransaction();

      return JSON.parse(
        JSON.stringify(savedSubscription),
      ) as VentureSubscription;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        'Error saving subscription with transaction',
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
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
