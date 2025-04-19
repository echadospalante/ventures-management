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
  PublicationClapData,
  PublicationCommentData,
  PublicationContentData,
  RoleData,
  UserContactData,
  UserData,
  UserDetailData,
  VentureCategoryData,
  VentureContactData,
  VentureData,
  VentureDetailData,
  VentureEventData,
  VentureLocationData,
  VenturePublicationData,
  VentureSponsorshipData,
  VentureSubscriptionData,
} from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';

import { RabbitMQConfig } from '../../config/amqp/amqp.connection';
import { SharedModule } from '../shared/shared.module';
import { EventAMQPProducer } from './domain/gateway/amqp/event.amqp';
import { EventCategoriesRepository } from './domain/gateway/database/event-categories.repository';
import { EventsRepository } from './domain/gateway/database/events.repository';
import { UserHttpService } from './domain/gateway/http/http.gateway';
import { EventCategoriesService } from './domain/service/event-categories.service';
import { EventsService } from './domain/service/events.service';
import { VentureEventAMQPProducerImpl } from './infrastructure/amqp/producers/event.amqp';
import { EventCategoriesRepositoryImpl } from './infrastructure/database/event-category.repository';
import { VentureEventsRepositoryImpl } from './infrastructure/database/event.repository';
import { UserHttpAdapter } from './infrastructure/http/http.service';
import { EventCategoriesController } from './infrastructure/web/v1/event-categories.controller';
import { VentureEventsController } from './infrastructure/web/v1/events.controller';
import { VentureModule } from '../ventures/venture.module';

@Module({
  controllers: [EventCategoriesController, VentureEventsController],
  providers: [
    EventCategoriesService,
    RabbitMQConfig,
    EventsService,
    {
      provide: EventCategoriesRepository,
      useClass: EventCategoriesRepositoryImpl,
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
      UserDetailData,
      VentureCategoryData,
      VentureData,
      VentureDetailData,
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
export class EventModule {}
