import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GoogleCloudStorageConfig } from '../../config/gce/gce.config';
import { HttpService } from '../../config/http/axios.config';
import { ContentCdn } from './domain/gateway/cdn/content-cdn.gateway';
import { CdnService } from './domain/service/cdn.service';
import { ContentCdnImpl } from './infrastructure/cdn/cdn.service';

@Module({
  controllers: [],
  providers: [
    GoogleCloudStorageConfig,
    HttpService,
    CdnService,
    {
      provide: ContentCdn,
      useClass: ContentCdnImpl,
    },
  ],
  imports: [ConfigModule],
  exports: [HttpService, CdnService],
})
export class SharedModule {}
