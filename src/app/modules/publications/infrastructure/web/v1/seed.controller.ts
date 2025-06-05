import * as Http from '@nestjs/common';

import { SeedService } from '../../../domain/service/seed.service';

const path = '/seed';

@Http.Controller(path)
export class SeedController {
  private readonly logger: Http.Logger = new Http.Logger(SeedController.name);

  public constructor(private seedService: SeedService) {}

  @Http.Post('/publications')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async seedPublications(@Http.Query('amount') amount: number) {
    return this.seedService.seedPublications(amount);
  }

  @Http.Post('/comments')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async seedComments(@Http.Query('amount') amount: number) {
    return this.seedService.seedComments(amount);
  }

  @Http.Post('/claps')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async seedClaps(@Http.Query('amount') amount: number) {
    return this.seedService.seedClaps(amount);
  }
}
