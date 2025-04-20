import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { PublicationCommentsService } from '../../../domain/service/publication-comments.service';

const path = '/publications';

@Http.Controller(path)
export class PublicationCommentsController {
  private readonly logger = new Logger(PublicationCommentsController.name);

  public constructor(
    private readonly publicationCommentsService: PublicationCommentsService,
  ) {}

  @Http.Get('/:publicationId/comments')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getPublicationCategories(
    @Http.Param('publicationId') publicationId: string,
    @Http.Query('skip') skip: number,
    @Http.Query('take') take: number,
  ) {
    return this.publicationCommentsService.getPublicationComments(
      publicationId,
      skip,
      take,
    );
  }

  @Http.Post('/:publicationId/comments')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async createPublicationCategory(
    @Http.Body() body: { content: string },
    @Http.Param('publicationId') publicationId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ) {
    return this.publicationCommentsService.saveComment(
      publicationId,
      requestedBy,
      body.content,
    );
  }

  @Http.Delete('/comments/:commentId')
  @Http.HttpCode(Http.HttpStatus.NO_CONTENT)
  public async deletePublicationCategory(
    @Http.Param('commentId') commentId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ) {
    return this.publicationCommentsService.deleteComment(
      commentId,
      requestedBy,
    );
  }
}
