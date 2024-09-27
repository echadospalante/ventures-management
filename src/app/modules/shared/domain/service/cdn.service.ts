import { Inject, Injectable } from '@nestjs/common';

import { ContentCdn } from '../gateway/cdn/content-cdn.gateway';

@Injectable()
export class CdnService {
  public constructor(
    @Inject(ContentCdn)
    private contentCdn: ContentCdn,
  ) {}

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    return this.contentCdn.uploadFile(file);
  }
}
