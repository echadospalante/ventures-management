import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Pagination, VentureSubscription } from 'echadospalante-core';

import { VenturesService } from '../../../ventures/domain/service/ventures.service';
import { SubscriptionAMQPProducer } from '../gateway/amqp/subscription.amqp';
import { SubscriptionsRepository } from '../gateway/database/subscriptions.repository';
import { UserHttpService } from '../gateway/http/http.gateway';

@Injectable()
export class SubscriptionsService {
  private readonly logger: Logger = new Logger(SubscriptionsService.name);

  public constructor(
    @Inject(SubscriptionsRepository)
    private subscriptionsRepository: SubscriptionsRepository,
    private venturesService: VenturesService,
    @Inject(SubscriptionAMQPProducer)
    private subscriptionAMQPProducer: SubscriptionAMQPProducer,
    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
  ) {}

  public async saveSubscription(
    ventureId: string,
    subscriberId: string,
  ): Promise<VentureSubscription> {
    await this.verifySubscriptionConditions(ventureId, subscriberId);

    return this.subscriptionsRepository
      .save(ventureId, subscriberId)
      .then((savedSubscription) => {
        this.subscriptionAMQPProducer.emitSubscriptionCreatedEvent(
          savedSubscription,
        );
        return savedSubscription;
      });
  }

  private async verifySubscriptionConditions(
    ventureId: string,
    subscriberId: string,
  ): Promise<void> {
    const isOwner = await this.venturesService.isVentureOwner(
      ventureId,
      subscriberId,
    );

    if (!isOwner) {
      throw new ForbiddenException(
        'El usuario no se puede suscribir a su propio emprendimiento',
      );
    }

    const [subscriber] = await Promise.all([
      this.userHttpService.getUserById(subscriberId),
      // this.userHttpService.getUserDetailById(ownerId),
    ]);

    if (!subscriber.active) {
      throw new NotFoundException('User not found');
    }
  }

  public getVentureSubscriptions(ventureId: string, pagination: Pagination) {
    const { take } = pagination;
    if (take > 100) {
      throw new BadRequestException(
        'La página no debe ser mayor a 100 elementos.',
      );
    }
    return this.subscriptionsRepository
      .findPaginated(ventureId, pagination)
      .then((subs) => ({
        total: subs.total,
        items: subs.items.flatMap((s) => s.subscriber),
      }));
  }
}
