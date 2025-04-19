import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  DepartmentData,
  EventCategoryData,
  EventDonationData,
  EventLocationData,
  MunicipalityData,
  NotificationData,
  PublicationClapData,
  PublicationCommentData,
  PublicationContentData,
  RoleData,
  EventContactData,
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
import { VentureAMQPProducer } from './domain/gateway/amqp/venture.amqp';
import { VentureCategoriesRepository } from './domain/gateway/database/venture-categories.repository';
import { VenturesRepository } from './domain/gateway/database/ventures.repository';
import { UserHttpService } from './domain/gateway/http/http.gateway';
import { VenturesService } from './domain/service/ventures.service';
import { VentureAMQPProducerImpl } from './infrastructure/amqp/producers/venture.amqp';
import { VentureCategoriesRepositoryImpl } from './infrastructure/database/venture-category.repository';
import { VenturesRepositoryImpl } from './infrastructure/database/venture.repository';
import { UserHttpAdapter } from './infrastructure/http/http.service';
import { VenturesController } from './infrastructure/web/v1/ventures.controller';
import { VentureCategoriesController } from './infrastructure/web/v1/venture-categories.controller';
import { VentureCategoriesService } from './domain/service/venture-categories.service';
import { VenturesDetailController } from './infrastructure/web/v1/venture-details.controller';
import { VenturesDetailService } from './domain/service/ventures-detail.service';

@Module({
  controllers: [
    VenturesController,
    VentureCategoriesController,
    VenturesDetailController,
  ],
  exports: [VenturesService],
  providers: [
    RabbitMQConfig,
    VenturesService,
    VentureCategoriesService,
    VenturesDetailService,
    {
      provide: VenturesRepository,
      useClass: VenturesRepositoryImpl,
    },
    {
      provide: VentureCategoriesRepository,
      useClass: VentureCategoriesRepositoryImpl,
    },
    {
      provide: VentureAMQPProducer,
      useClass: VentureAMQPProducerImpl,
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
      UserDetailData,
      VentureCategoryData,
      VentureData,
      VentureDetailData,
      VentureLocationData,
      VentureContactData,
      VentureEventData,
      VenturePublicationData,
      PublicationClapData,
      PublicationCommentData,
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
