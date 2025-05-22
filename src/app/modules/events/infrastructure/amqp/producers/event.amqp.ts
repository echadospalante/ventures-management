import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Channel } from 'amqplib';
import { VentureEvent } from 'echadospalante-domain';

import { RabbitMQConfig } from '../../../../../config/amqp/amqp.connection';
import { EventAMQPProducer } from '../../../domain/gateway/amqp/event.amqp';

@Injectable()
export class VentureEventAMQPProducerImpl implements EventAMQPProducer {
  private readonly logger: Logger = new Logger(
    VentureEventAMQPProducerImpl.name,
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
          .then((channel) => this.assertVentureEventsExchange(channel))
          // Create/Assert queues
          .then((channel) => this.assertVentureEventsEventsQueue(channel))
          // Bind queues
          .then((channel) => this.bindVentureEventsEventsQueues(channel)),
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

  private assertVentureEventsExchange(channel: Channel): PromiseLike<Channel> {
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

  private assertVentureEventsEventsQueue(
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

  private bindVentureEventsEventsQueues(
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

  public emitVentureEventCreatedEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_CREATED_RK'),
      ventureEventEvent,
    );
  }

  public emitVentureEventUpdatedEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_UPDATED_RK'),
      ventureEventEvent,
    );
  }

  public emitVentureEventEnabledEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_ENABLED_RK'),
      ventureEventEvent,
    );
  }

  public emitVentureEventDisabledEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_DISABLED_RK'),
      ventureEventEvent,
    );
  }

  public emitVentureEventDeletedEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_DELETED_RK'),
      ventureEventEvent,
    );
  }

  public emitVentureEventLoggedEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_LOGGED_RK'),
      ventureEventEvent,
    );
  }

  public emitVentureEventRegisteredEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_REGISTERED_RK'),
      ventureEventEvent,
    );
  }

  public emitVentureEventVerifiedEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_VERIFIED_RK'),
      ventureEventEvent,
    );
  }

  public emitVentureEventUnverifiedEvent(ventureEventEvent: VentureEvent) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_EVENT_UNVERIFIED_RK'),
      ventureEventEvent,
    );
  }
}
