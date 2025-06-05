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
import { VentureModule } from '../ventures/venture.module';
import { EventAMQPProducer } from './domain/gateway/amqp/event.amqp';
import { EventCategoriesRepository } from './domain/gateway/database/event-categories.repository';
import { EventDonationsRepository } from './domain/gateway/database/event-donations.repository';
import { EventsRepository } from './domain/gateway/database/events.repository';
import { UserHttpService } from './domain/gateway/http/http.gateway';
import { EventCategoriesService } from './domain/service/event-categories.service';
import { EventDonationsService } from './domain/service/event-donarions.service';
import { EventsService } from './domain/service/events.service';
import { VentureEventAMQPProducerImpl } from './infrastructure/amqp/producers/event.amqp';
import { EventCategoriesRepositoryImpl } from './infrastructure/database/event-category.repository';
import { EventDonationsRepositoryImpl } from './infrastructure/database/event-donation.repository';
import { VentureEventsRepositoryImpl } from './infrastructure/database/event.repository';
import { UserHttpAdapter } from './infrastructure/http/http.service';
import { EventCategoriesController } from './infrastructure/web/v1/event-categories.controller';
import { EventDonationsController } from './infrastructure/web/v1/event-donations.controller';
import { VentureEventsController } from './infrastructure/web/v1/events.controller';
import { SeedService } from './domain/service/seed.service';
import { SeedController } from './infrastructure/web/v1/seed.controller';

@Module({
  controllers: [
    EventCategoriesController,
    VentureEventsController,
    EventDonationsController,
    SeedController,
  ],
  providers: [
    EventCategoriesService,
    EventDonationsService,
    RabbitMQConfig,
    EventsService,
    SeedService,
    {
      provide: EventCategoriesRepository,
      useClass: EventCategoriesRepositoryImpl,
    },
    {
      provide: EventDonationsRepository,
      useClass: EventDonationsRepositoryImpl,
    },
    {
      provide: EventsRepository,
      useClass: VentureEventsRepositoryImpl,
    },
    {
      provide: UserHttpService,
      useClass: UserHttpAdapter,
    },
    {
      provide: EventAMQPProducer,
      useClass: VentureEventAMQPProducerImpl,
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
      PublicationCategoryData,
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
export class EventModule {}
