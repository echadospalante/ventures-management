import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { environment, JoiValidationSchema } from '../env/joi.config';
import { RabbitMQConfig } from './config/amqp/amqp.connection';
import { VentureModule } from './modules/ventures/venture.module';
import { SharedModule } from './modules/shared/shared.module';
import { GoogleCloudStorageConfig } from './config/gce/gce.config';
import { HttpService } from './config/http/axios.config';

@Module({
  providers: [RabbitMQConfig, GoogleCloudStorageConfig, HttpService],
  exports: [RabbitMQConfig, GoogleCloudStorageConfig, HttpService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [environment],
      isGlobal: true,
      validationSchema: JoiValidationSchema,
    }),
    VentureModule,
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        logging: configService.get<boolean>('DB_LOGGING'),
        applicationName: configService.get<string>('APP_NAME'),
        autoLoadEntities: true,
        migrationsRun: false,
        migrationsTableName: 'z_typeorm_migrations',
      }),
    }),
  ],
})
export class AppModule {}
