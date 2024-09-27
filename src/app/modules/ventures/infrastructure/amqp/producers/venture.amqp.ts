import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Channel } from 'amqplib';
import { Venture } from 'echadospalante-core';

import { RabbitMQConfig } from '../../../../../config/amqp/amqp.connection';
import { VentureAMQPProducer } from '../../../domain/gateway/amqp/venture.amqp';

@Injectable()
export class VentureAMQPProducerImpl implements VentureAMQPProducer {
  private readonly logger: Logger = new Logger(VentureAMQPProducerImpl.name);

  public constructor(
    private configService: ConfigService,
    private rabbitMQConfigService: RabbitMQConfig,
  ) {
    this.rabbitMQConfigService.client.then(
      (connection) =>
        connection
          .createChannel()
          // Create/Assert exchange
          .then((channel) => this.assertVenturesExchange(channel))
          // Create/Assert queues
          .then((channel) => this.assertVenturesEventsQueue(channel))
          // Bind queues
          .then((channel) => this.bindVenturesEventsQueues(channel)),
      // Add all exchanges, exchanges, queues, bindings and subscriptions.
    );
  }

  private get venturesEventsQueues() {
    return [
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_CREATED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_CREATED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_UPDATED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_UPDATED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_ENABLED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_ENABLED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_DISABLED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_DISABLED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_DELETED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_DELETED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_REGISTERED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_REGISTERED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_VERIFIED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_VERIFIED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_UNVERIFIED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_UNVERIFIED_RK'),
      },
      {
        queue: this.configService.getOrThrow<string>(
          'RABBIT_USER_LOGGED_QUEUE',
        ),
        rk: this.configService.getOrThrow<string>('RABBIT_USER_LOGGED_RK'),
      },
    ];
  }

  private get venturesExchange() {
    return this.configService.getOrThrow<string>('RABBIT_USERS_EXCHANGE');
  }

  private get venturesExchangeType() {
    return this.configService.getOrThrow<string>('RABBIT_USERS_EXCHANGE_TYPE');
  }

  private sendMessageToQueue<T>(
    routingKey: string,
    message: T,
  ): Promise<boolean> {
    return this.rabbitMQConfigService.client
      .then((connection) => connection.createChannel())
      .then((channel) => {
        const result = channel.publish(
          this.venturesExchange,
          routingKey,
          Buffer.from(JSON.stringify(message)),
          {
            /* Publish args Ej: priority */
          },
        );
        return channel.close().then(() => result);
      });
  }

  private assertVenturesExchange(channel: Channel): PromiseLike<Channel> {
    return channel
      .assertExchange(this.venturesExchange, this.venturesExchangeType, {
        /* Exchange args */
        durable: true,
      })
      .then(({ exchange }) => {
        this.logger.log(`🟢 RabbitMQ: Asserted exchange ${exchange}`);
        return channel;
      });
  }

  private assertVenturesEventsQueue(channel: Channel): PromiseLike<Channel> {
    return Promise.all(
      this.venturesEventsQueues.map(({ queue }) =>
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

  private bindVenturesEventsQueues(channel: Channel): PromiseLike<Channel> {
    return Promise.all(
      this.venturesEventsQueues.map(({ queue, rk }) => {
        return channel.bindQueue(queue, this.venturesExchange, rk, {
          /* Binding args */
        });
      }),
    ).then(() => channel);
  }

  public emitVentureCreatedEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_CREATED_RK'),
      venture,
    );
  }

  public emitVentureUpdatedEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_UPDATED_RK'),
      venture,
    );
  }

  public emitVentureEnabledEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_ENABLED_RK'),
      venture,
    );
  }

  public emitVentureDisabledEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_DISABLED_RK'),
      venture,
    );
  }

  public emitVentureDeletedEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_DELETED_RK'),
      venture,
    );
  }

  public emitVentureLoggedEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_LOGGED_RK'),
      venture,
    );
  }

  public emitVentureRegisteredEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_REGISTERED_RK'),
      venture,
    );
  }

  public emitVentureVerifiedEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_VERIFIED_RK'),
      venture,
    );
  }

  public emitVentureUnverifiedEvent(venture: Venture) {
    return this.sendMessageToQueue(
      this.configService.getOrThrow<string>('RABBIT_USER_UNVERIFIED_RK'),
      venture,
    );
  }
}
