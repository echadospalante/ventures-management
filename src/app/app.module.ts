import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { environment } from '../env/env';
import { JoiValidationSchema } from '../env/joi.config';
import { RabbitMQConfig } from './config/amqp/amqp.connection';
import { VentureModule } from './modules/ventures/venture.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  providers: [RabbitMQConfig],
  exports: [RabbitMQConfig],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [environment],
      validationSchema: JoiValidationSchema,
    }),
    VentureModule,
    SharedModule,
  ],
})
export class AppModule {}
