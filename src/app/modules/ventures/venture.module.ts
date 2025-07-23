import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  DepartmentData,
  EventCategoryData,
  EventContactData,
  EventDonationData,
  EventLocationData,
  MunicipalityData,
  NotificationData,
  PublicationCategoryData,
  PublicationClapData,
  PublicationCommentData,
  PublicationContentData,
  RoleData,
  UserContactData,
  UserData,
  VentureCategoryData,
  VentureContactData,
  VentureData,
  VentureEventData,
  VentureLocationData,
  VenturePublicationData,
  VentureSponsorshipData,
  VentureSubscriptionData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';

import { RabbitMQConfig } from '../../config/amqp/amqp.connection';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionAMQPProducer } from './domain/gateway/amqp/subscription.amqp';
import { VentureAMQPProducer } from './domain/gateway/amqp/venture.amqp';
import { MunicipalitiesRepository } from './domain/gateway/database/municipalities.repository';
import { VentureCategoriesRepository } from './domain/gateway/database/venture-categories.repository';
import { VentureSponsorshipsRepository } from './domain/gateway/database/venture-sponsorships.repository';
import { VentureSubscriptionsRepository } from './domain/gateway/database/venture-subscriptions.repository';
import { VenturesRepository } from './domain/gateway/database/ventures.repository';
import { UserHttpService } from './domain/gateway/http/http.gateway';
import { SeedService } from './domain/service/seed.service';
import { VentureCategoriesService } from './domain/service/venture-categories.service';
import { VentureSponsorshipsService } from './domain/service/venture-sponsorships.service';
import { VentureSubscriptionsService } from './domain/service/venture-subscriptions.service';
import { VenturesService } from './domain/service/ventures.service';
import { SubscriptionAMQPProducerImpl } from './infrastructure/amqp/producers/subscription.amqp';
import { VentureAMQPProducerImpl } from './infrastructure/amqp/producers/venture.amqp';
import { MunicipalitiesRepositoryImpl } from './infrastructure/database/municipalities.repository';
import { VentureCategoriesRepositoryImpl } from './infrastructure/database/venture-category.repository';
import { VentureSponsorshipsRepositoryImpl } from './infrastructure/database/venture-sponsorship.repository';
import { VentureSubscriptionsRepositoryImpl } from './infrastructure/database/venture-subscription.repository';
import { VenturesRepositoryImpl } from './infrastructure/database/venture.repository';
import { UserHttpAdapter } from './infrastructure/http/http.service';
import { SeedController } from './infrastructure/web/v1/seed.controller';
import { SubscriptionsController } from './infrastructure/web/v1/subscriptions.controller';
import { VentureCategoriesController } from './infrastructure/web/v1/venture-categories.controller';
import { VentureSponsorshipsController } from './infrastructure/web/v1/venture-sponsorships.controller';
import { VenturesController } from './infrastructure/web/v1/ventures.controller';

@Module({
  controllers: [
    VenturesController,
    VentureCategoriesController,
    VentureSponsorshipsController,
    SubscriptionsController,
    SeedController,
  ],
  exports: [VenturesService, VentureCategoriesService],
  providers: [
    RabbitMQConfig,
    VenturesService,
    SeedService,
    VentureCategoriesService,
    VentureSponsorshipsService,
    VentureSubscriptionsService,
    {
      provide: VenturesRepository,
      useClass: VenturesRepositoryImpl,
    },
    {
      provide: VentureSponsorshipsRepository,
      useClass: VentureSponsorshipsRepositoryImpl,
    },
    {
      provide: MunicipalitiesRepository,
      useClass: MunicipalitiesRepositoryImpl,
    },
    {
      provide: VentureCategoriesRepository,
      useClass: VentureCategoriesRepositoryImpl,
    },
    {
      provide: VentureSubscriptionsRepository,
      useClass: VentureSubscriptionsRepositoryImpl,
    },
    {
      provide: VentureAMQPProducer,
      useClass: VentureAMQPProducerImpl,
    },
    {
      provide: SubscriptionAMQPProducer,
      useClass: SubscriptionAMQPProducerImpl,
    },
    {
      provide: UserHttpService,
      useClass: UserHttpAdapter,
    },
  ],
  imports: [
    ConfigModule,
    SharedModule,
    TypeOrmModule.forFeature([
      UserData,
      RoleData,
      UserContactData,
      VentureCategoryData,
      VentureData,
      VentureLocationData,
      VentureContactData,
      VentureEventData,
      VenturePublicationData,
      PublicationClapData,
      PublicationCommentData,
      PublicationCategoryData,
      PublicationContentData,
      EventContactData,
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
export class VentureModule {}
