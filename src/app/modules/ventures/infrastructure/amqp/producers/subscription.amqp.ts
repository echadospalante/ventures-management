import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Channel } from 'amqplib';

import { RabbitMQConfig } from '../../../../../config/amqp/amqp.connection';
import { SubscriptionAMQPProducer } from '../../../domain/gateway/amqp/subscription.amqp';
import { VentureSubscription } from 'echadospalante-domain';

@Injectable()
export class SubscriptionAMQPProducerImpl implements SubscriptionAMQPProducer {
  private readonly logger: Logger = new Logger(
    SubscriptionAMQPProducerImpl.name,
  );

  public constructor(
    private configService: ConfigService,
    private rabbitMQConfigService: RabbitMQConfig,
  ) {
    this.rabbitMQConfigService.client.then(
      (connection) =>
        connection
          .createChannel()
          // Create/Assert exchange
          .then((channel) => this.assertSubscriptionsExchange(channel))
          // Create/Assert queues
          .then((channel) =>
            this.assertSubscriptionsSubscriptionsQueue(channel),
          )
          // Bind queues
          .then((channel) =>
            this.bindSubscriptionsSubscriptionsQueues(channel),
          ),
      // Add all exchanges, exchanges, queues, bindings and subscriptions.
    );
  }

  emitSubscriptionCreatedEvent(subscription: any): Promise<boolean> {
    return Promise.resolve(true);
  }

  emitSubscriptionUpdatedEvent(subscription: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  emitSubscriptionEnabledEvent(subscription: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  emitSubscriptionDisabledEvent(subscription: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  emitSubscriptionLoggedEvent(subscription: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  emitSubscriptionDeletedEvent(subscription: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  emitSubscriptionRegisteredEvent(subscription: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  emitSubscriptionVerifiedEvent(subscription: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  emitSubscriptionUnverifiedEvent(subscription: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  private get ventureSubscriptionsSubscriptionsQueues() {
    return [
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_EVENT_CREATED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_EVENT_CREATED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_EVENT_UPDATED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_EVENT_UPDATED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_EVENT_ENABLED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_EVENT_ENABLED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_EVENT_DISABLED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_EVENT_DISABLED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_EVENT_DELETED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_EVENT_DELETED_RK'),
      },

      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_EVENT_VERIFIED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_EVENT_VERIFIED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_EVENT_UNVERIFIED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_EVENT_UNVERIFIED_RK'),
      },
    ];
  }

  private get ventureSubscriptionsExchange() {
    return this.configService.getOrThrow<string>('RABBIT_EVENTS_EXCHANGE');
  }

  private get ventureSubscriptionsExchangeType() {
    return this.configService.getOrThrow<string>('RABBIT_EVENTS_EXCHANGE_TYPE');
  }

  private sendMessageToQueue<T>(
    routingKey: string,
    message: T,
  ): Promise<boolean> {
    return this.rabbitMQConfigService.client
      .then((connection) => connection.createChannel())
      .then((channel) => {
        const result = channel.publish(
          this.ventureSubscriptionsExchange,
          routingKey,
          Buffer.from(JSON.stringify(message)),
          {
            /* Publish args Ej: priority */
          },
        );
        return channel.close().then(() => result);
      });
  }

  private assertSubscriptionsExchange(channel: Channel): PromiseLike<Channel> {
    return channel
      .assertExchange(
        this.ventureSubscriptionsExchange,
        this.ventureSubscriptionsExchangeType,
        {
          /* Exchange args */
          durable: true,
        },
      )
      .then(({ exchange }) => {
        this.logger.log(`🟢 RabbitMQ: Asserted exchange ${exchange}`);
        return channel;
      });
  }

  private assertSubscriptionsSubscriptionsQueue(
    channel: Channel,
  ): PromiseLike<Channel> {
    return Promise.all(
      this.ventureSubscriptionsSubscriptionsQueues.map(({ queue }) =>
        channel
          .assertQueue(queue, {
            /* Queue args */
            durable: true,
            exclusive: false,
          })
          .then(({ queue }) => {
            this.logger.log(`Created queue ${queue}`);
            return channel;
          }),
      ),
    ).then(() => channel);
  }

  private bindSubscriptionsSubscriptionsQueues(
    channel: Channel,
  ): PromiseLike<Channel> {
    return Promise.all(
      this.ventureSubscriptionsSubscriptionsQueues.map(({ queue, rk }) => {
        return channel.bindQueue(queue, this.ventureSubscriptionsExchange, rk, {
          /* Binding args */
        });
      }),
    ).then(() => channel);
  }

  public emitSubscriptionCreatedSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_CREATED_RK'),
      ventureSubscriptionSubscription,
    );
  }

  public emitSubscriptionUpdatedSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_UPDATED_RK'),
      ventureSubscriptionSubscription,
    );
  }

  public emitSubscriptionEnabledSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_ENABLED_RK'),
      ventureSubscriptionSubscription,
    );
  }

  public emitSubscriptionDisabledSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_DISABLED_RK'),
      ventureSubscriptionSubscription,
    );
  }

  public emitSubscriptionDeletedSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_DELETED_RK'),
      ventureSubscriptionSubscription,
    );
  }

  public emitSubscriptionLoggedSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_LOGGED_RK'),
      ventureSubscriptionSubscription,
    );
  }

  public emitSubscriptionRegisteredSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_REGISTERED_RK'),
      ventureSubscriptionSubscription,
    );
  }

  public emitSubscriptionVerifiedSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_VERIFIED_RK'),
      ventureSubscriptionSubscription,
    );
  }

  public emitSubscriptionUnverifiedSubscription(
    ventureSubscriptionSubscription: VentureSubscription,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_UNVERIFIED_RK'),
      ventureSubscriptionSubscription,
    );
  }
}
