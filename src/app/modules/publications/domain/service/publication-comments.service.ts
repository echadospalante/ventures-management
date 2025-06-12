import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PublicationCommentsRepository } from '../gateway/database/publication-comments.repository';
import { UserHttpService } from '../gateway/http/http.gateway';

@Injectable()
export class PublicationCommentsService {
  private readonly logger: Logger = new Logger(PublicationCommentsService.name);

  public constructor(
    @Inject(PublicationCommentsRepository)
    private readonly publicationCategoriesRepository: PublicationCommentsRepository,
    @Inject(UserHttpService)
    private readonly userHttpService: UserHttpService,
  ) {}

  public async saveComment(
    publicationId: string,
    authorEmail: string,
    comment: string,
  ) {
    try {
      const author = await this.userHttpService.getUserByEmail(authorEmail);

      return this.publicationCategoriesRepository.save(
        publicationId,
        author.id,
        comment,
      );
    } catch (error) {
      this.logger.error(
        `Error saving comment for publication ${publicationId}: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException(
        `Publication with id ${publicationId} not found`,
      );
    }
  }

  public getPublicationComments(
    publicationId: string,
    skip: number,
    take: number,
  ) {
    return this.publicationCategoriesRepository.findByPublicationId(
      publicationId,
      skip,
      take,
    );
  }

  public async deleteComment(commentId: string, requestedBy: string) {
    const comment =
      await this.publicationCategoriesRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    if (comment.author.id !== requestedBy) {
      throw new NotFoundException(
        `Comment with id ${commentId} not found for user ${requestedBy}`,
      );
    }

    return this.publicationCategoriesRepository.deleteComment(commentId);
  }
}
