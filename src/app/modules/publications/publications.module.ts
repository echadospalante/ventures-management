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
  VentureLocationData,
  VenturePublicationData,
  VentureSponsorshipData,
  VentureSubscriptionData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';

import { RabbitMQConfig } from '../../config/amqp/amqp.connection';
import { SharedModule } from '../shared/shared.module';
import { VentureModule } from '../ventures/venture.module';
import { PublicationAMQPProducer } from './domain/gateway/amqp/publication.amqp';
import { PublicationCategoriesRepository } from './domain/gateway/database/publication-categories.repository';
import { PublicationClapsRepository } from './domain/gateway/database/publication-claps.repository';
import { PublicationCommentsRepository } from './domain/gateway/database/publication-comments.repository';
import { PublicationsRepository } from './domain/gateway/database/publications.repository';
import { UserHttpService } from './domain/gateway/http/http.gateway';
import { PublicationCategoriesService } from './domain/service/publication-categories.service';
import { PublicationClapsService } from './domain/service/publication-claps.service';
import { PublicationCommentsService } from './domain/service/publication-comments.service';
import { PublicationsService } from './domain/service/publications.service';
import { PublicationAMQPProducerImpl } from './infrastructure/amqp/producers/publication.amqp';
import { PublicationCategoriesRepositoryImpl } from './infrastructure/database/publication-category.repository';
import { PublicationClapsRepositoryImpl } from './infrastructure/database/publication-clap.repository';
import { PublicationCommentsRepositoryImpl } from './infrastructure/database/publication-comment.repository';
import { PublicationsRepositoryImpl } from './infrastructure/database/publication.repository';
import { UserHttpAdapter } from './infrastructure/http/http.service';
import { PublicationCategoriesController } from './infrastructure/web/v1/publication-categories.controller';
import { PublicationClapsController } from './infrastructure/web/v1/publication-claps.controller';
import { PublicationCommentsController } from './infrastructure/web/v1/publication-comments.controller';
import { VenturePublicationsController } from './infrastructure/web/v1/publications.controller';
import { SeedController } from './infrastructure/web/v1/seed.controller';
import { SeedService } from './domain/service/seed.service';

@Module({
  controllers: [
    PublicationCategoriesController,
    VenturePublicationsController,
    PublicationCommentsController,
    PublicationClapsController,
    SeedController,
  ],
  providers: [
    PublicationCategoriesService,
    PublicationCommentsService,
    PublicationClapsService,
    RabbitMQConfig,
    PublicationsService,
    SeedService,
    {
      provide: PublicationCategoriesRepository,
      useClass: PublicationCategoriesRepositoryImpl,
    },
    {
      provide: PublicationCommentsRepository,
      useClass: PublicationCommentsRepositoryImpl,
    },
    {
      provide: PublicationClapsRepository,
      useClass: PublicationClapsRepositoryImpl,
    },
    {
      provide: PublicationsRepository,
      useClass: PublicationsRepositoryImpl,
    },
    {
      provide: UserHttpService,
      useClass: UserHttpAdapter,
    },
    {
      provide: PublicationAMQPProducer,
      useClass: PublicationAMQPProducerImpl,
    },
  ],
  exports: [PublicationsService, PublicationCategoriesService],
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
      VenturePublicationData,
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
export class PublicationsModule {}
