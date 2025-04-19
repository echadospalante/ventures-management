import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

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

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: configService.get<boolean>('DB_SYNC'),
  logging: configService.get<boolean>('DB_LOGGING'),
  applicationName: configService.get<string>('APP_NAME'),
  entities: [
    DepartmentData,
    EventCategoryData,
    EventDonationData,
    EventLocationData,
    EventContactData,
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
  ],
  migrations: ['src/app/config/typeorm/migrations/*.ts'],
  migrationsTableName: 'z_typeorm_migrations',
});
