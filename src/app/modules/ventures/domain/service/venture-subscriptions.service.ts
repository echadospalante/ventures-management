import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  PaginatedBody,
  Pagination,
  User,
  VentureSubscription,
} from 'echadospalante-domain';

import { VenturesService } from './ventures.service';
import { SubscriptionAMQPProducer } from '../gateway/amqp/subscription.amqp';
import { VentureSubscriptionsRepository } from '../gateway/database/venture-subscriptions.repository';
import { UserHttpService } from '../gateway/http/http.gateway';

@Injectable()
export class VentureSubscriptionsService {
  private readonly logger: Logger = new Logger(
    VentureSubscriptionsService.name,
  );

  public constructor(
    @Inject(VentureSubscriptionsRepository)
    private subscriptionsRepository: VentureSubscriptionsRepository,
    private venturesService: VenturesService,
    @Inject(SubscriptionAMQPProducer)
    private subscriptionAMQPProducer: SubscriptionAMQPProducer,
    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
  ) {}

  public getVentureSubscriptionStatus(
    ventureId: string,
    requesterEmail: string,
  ): Promise<boolean> {
    return this.subscriptionsRepository.exists(ventureId, requesterEmail);
  }

  public async saveSubscription(
    ventureId: string,
    subscriberEmail: string,
  ): Promise<VentureSubscription> {
    const subscriber = await this.verifySubscriptionConditions(
      ventureId,
      subscriberEmail,
    );

    console.log({ subscriber });

    return this.subscriptionsRepository
      .save(ventureId, subscriber.id)
      .then((savedSubscription) => {
        this.subscriptionAMQPProducer.emitSubscriptionCreatedEvent(
          savedSubscription,
        );
        return savedSubscription;
      });
  }

  private async verifySubscriptionConditions(
    ventureId: string,
    requesterEmail: string,
  ) {
    const isOwner = await this.venturesService.isVentureOwner(
      ventureId,
      requesterEmail,
    );

    if (isOwner) {
      throw new ForbiddenException(
        'El usuario no se puede suscribir a su propio emprendimiento',
      );
    }

    const subscriber =
      await this.userHttpService.getUserByEmail(requesterEmail);

    if (!subscriber.active) {
      throw new NotFoundException('User not found');
    }

    return subscriber;
  }

  public getVentureSubscriptions(
    ventureId: string,
    pagination: Pagination,
  ): Promise<PaginatedBody<User>> {
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
        items: subs.items
          .flatMap((s) => s.subscriber)
          .filter((u) => !!u)
          .map((u) => u as User),
      }));
  }

  public async deleteSubscription(
    ventureId: string,
    requesterEmail: string,
  ): Promise<boolean> {
    // return this.subscriptionsRepository.delete(ventureId, requestedBy);
    const user = await this.userHttpService.getUserByEmail(requesterEmail);
    if (!user) {
      console.log('User not found:', requesterEmail);
      throw new NotFoundException(
        `User with email ${requesterEmail} not found`,
      );
    }
    const subscription =
      await this.subscriptionsRepository.findByVentureAndUser(
        ventureId,
        user.id,
      );
    if (!subscription) {
      console.log('Subscription not found');
      throw new NotFoundException(`Subscription not found`);
    }

    return this.subscriptionsRepository.delete(ventureId, subscription.id);
  }
}
