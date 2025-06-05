import * as Http from '@nestjs/common';

import { SeedService } from '../../../domain/service/seed.service';

const path = '/seed';

@Http.Controller(path)
export class SeedController {
  private readonly logger: Http.Logger = new Http.Logger(SeedController.name);

  public constructor(private seedService: SeedService) {}

  @Http.Post('/ventures')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async seedVentures(@Http.Query('amount') amount: number) {
    return this.seedService.seedVentures(amount);
  }
}
