import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { PublicationClapsService } from '../../../domain/service/publication-claps.service';

const path = '/publications';

@Http.Controller(path)
export class PublicationClapsController {
  private readonly logger = new Logger(PublicationClapsController.name);

  public constructor(
    private readonly publicationClapsService: PublicationClapsService,
  ) {}

  @Http.Get('/:publicationId/claps')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getPublicationCategories(
    @Http.Param('publicationId') publicationId: string,
    @Http.Query('skip') skip: number,
    @Http.Query('take') take: number,
  ) {
    return this.publicationClapsService.getPublicationClaps(
      publicationId,
      skip,
      take,
    );
  }

  @Http.Post('/:publicationId/claps')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async createPublicationCategory(
    @Http.Param('publicationId') publicationId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ) {
    return this.publicationClapsService.saveClap(publicationId, requestedBy);
  }

  @Http.Delete('/claps/:clapId')
  @Http.HttpCode(Http.HttpStatus.NO_CONTENT)
  public async deletePublicationCategory(
    @Http.Param('clapId') clapId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ) {
    return this.publicationClapsService.deleteClap(clapId, requestedBy);
  }
}
