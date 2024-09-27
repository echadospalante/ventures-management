import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CdnService } from './domain/service/cdn.service';
import { ContentCdn } from './domain/gateway/cdn/content-cdn.gateway';
import { ContentCdnImpl } from './infrastructure/cdn/cdn.service';
import { VenturesController } from '../ventures/infrastructure/web/v1/venture.controller';

@Module({
  controllers: [VenturesController],
  providers: [
    CdnService,
    {
      provide: ContentCdn,
      useClass: ContentCdnImpl,
    },
  ],
  imports: [ConfigModule],
})
export class SharedModule {}
