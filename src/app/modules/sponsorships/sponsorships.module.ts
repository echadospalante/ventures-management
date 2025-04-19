import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  UserData,
  RoleData,
  UserContactData,
  VentureCategoryData,
  VentureData,
  VentureLocationData,
  VentureContactData,
  VentureEventData,
  EventContactData,
  VenturePublicationData,
  PublicationClapData,
  PublicationCommentData,
  PublicationContentData,
  VentureSponsorshipData,
  VentureSubscriptionData,
  EventLocationData,
  EventCategoryData,
  EventDonationData,
  MunicipalityData,
  DepartmentData,
  NotificationData,
} from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';

import { RabbitMQConfig } from '../../config/amqp/amqp.connection';
import { SharedModule } from '../shared/shared.module';
import { VentureModule } from '../ventures/venture.module';
import { UserHttpService } from './domain/gateway/http/http.gateway';
import { UserHttpAdapter } from './infrastructure/http/http.service';
import { SubscriptionsController } from './infrastructure/web/v1/subscriptions.controller';
import { SubscriptionsService } from './domain/service/subscriptions.service';
import { SubscriptionsRepository } from './domain/gateway/database/subscriptions.repository';
import { SubscriptionsRepositoryImpl } from './infrastructure/database/subscription.repository';
import { SubscriptionAMQPProducer } from './domain/gateway/amqp/subscription.amqp';
import { SubscriptionAMQPProducerImpl } from './infrastructure/amqp/producers/subscription.amqp';

@Module({
  controllers: [SubscriptionsController],
  providers: [
    RabbitMQConfig,
    SubscriptionsService,
    {
      provide: SubscriptionsRepository,
      useClass: SubscriptionsRepositoryImpl,
    },
    {
      provide: UserHttpService,
      useClass: UserHttpAdapter,
    },
    {
      provide: SubscriptionAMQPProducer,
      useClass: SubscriptionAMQPProducerImpl,
    },
  ],
  imports: [
    ConfigModule,
    SharedModule,
    VentureModule,
    TypeOrmModule.forFeature([
      UserData,
      RoleData,
      UserContactData,
      VentureCategoryData,
      VentureData,
      VentureLocationData,
      VentureContactData,
      VentureEventData,
      EventContactData,
      VenturePublicationData,
      PublicationClapData,
      PublicationCommentData,
      PublicationContentData,
      VentureSponsorshipData,
      VentureSubscriptionData,
      EventLocationData,
      EventCategoryData,
      EventDonationData,
      MunicipalityData,
      DepartmentData,
      NotificationData,
    ]),
  ],
})
export class SponsorshipsModule {}
