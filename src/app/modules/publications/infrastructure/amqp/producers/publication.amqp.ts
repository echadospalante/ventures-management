import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Channel } from 'amqplib';
import { VenturePublication } from 'echadospalante-domain';

import { RabbitMQConfig } from '../../../../../config/amqp/amqp.connection';
import { PublicationAMQPProducer } from '../../../domain/gateway/amqp/publication.amqp';

@Injectable()
export class PublicationAMQPProducerImpl implements PublicationAMQPProducer {
  private readonly logger: Logger = new Logger(
    PublicationAMQPProducerImpl.name,
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
          .then((channel) => this.assertVenturePublicationsExchange(channel))
          // Create/Assert queues
          .then((channel) => this.assertVenturePublicationsEventsQueue(channel))
          // Bind queues
          .then((channel) => this.bindVenturePublicationsEventsQueues(channel)),
      // Add all exchanges, exchanges, queues, bindings and subscriptions.
    );
  }

  private get ventureEventsEventsQueues() {
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

  private get ventureEventsExchange() {
    return this.configService.getOrThrow<string>('RABBIT_EVENTS_EXCHANGE');
  }

  private get ventureEventsExchangeType() {
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
          this.ventureEventsExchange,
          routingKey,
          Buffer.from(JSON.stringify(message)),
          {
            /* Publish args Ej: priority */
          },
        );
        return channel.close().then(() => result);
      });
  }

  private assertVenturePublicationsExchange(
    channel: Channel,
  ): PromiseLike<Channel> {
    return channel
      .assertExchange(
        this.ventureEventsExchange,
        this.ventureEventsExchangeType,
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

  private assertVenturePublicationsEventsQueue(
    channel: Channel,
  ): PromiseLike<Channel> {
    return Promise.all(
      this.ventureEventsEventsQueues.map(({ queue }) =>
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

  private bindVenturePublicationsEventsQueues(
    channel: Channel,
  ): PromiseLike<Channel> {
    return Promise.all(
      this.ventureEventsEventsQueues.map(({ queue, rk }) => {
        return channel.bindQueue(queue, this.ventureEventsExchange, rk, {
          /* Binding args */
        });
      }),
    ).then(() => channel);
  }

  public emitVenturePublicationCreatedEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_CREATED_RK'),
      ventureEventEvent,
    );
  }

  public emitVenturePublicationUpdatedEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_UPDATED_RK'),
      ventureEventEvent,
    );
  }

  public emitVenturePublicationEnabledEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_ENABLED_RK'),
      ventureEventEvent,
    );
  }

  public emitVenturePublicationDisabledEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_DISABLED_RK'),
      ventureEventEvent,
    );
  }

  public emitVenturePublicationDeletedEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_DELETED_RK'),
      ventureEventEvent,
    );
  }

  public emitVenturePublicationLoggedEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_LOGGED_RK'),
      ventureEventEvent,
    );
  }

  public emitVenturePublicationRegisteredEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_REGISTERED_RK'),
      ventureEventEvent,
    );
  }

  public emitVenturePublicationVerifiedEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_VERIFIED_RK'),
      ventureEventEvent,
    );
  }

  public emitVenturePublicationUnverifiedEvent(
    ventureEventEvent: VenturePublication,
  ) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_UNVERIFIED_RK'),
      ventureEventEvent,
    );
  }
}
