import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PublicationCommentsRepository } from '../gateway/database/publication-comments.repository';
import { UserHttpService } from '../gateway/http/http.gateway';

@Injectable()
export class PublicationCommentsService {
  private readonly logger: Logger = new Logger(PublicationCommentsService.name);

  public constructor(
    @Inject(PublicationCommentsRepository)
    private readonly publicationCommentsRepository: PublicationCommentsRepository,
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

      return this.publicationCommentsRepository.save(
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
    return this.publicationCommentsRepository.findByPublicationId(
      publicationId,
      skip,
      take,
    );
  }

  public async deleteComment(
    publicationId: string,
    commentId: string,
    requesterEmail: string,
  ) {
    const comment =
      await this.publicationCommentsRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    if (comment.author.email !== requesterEmail) {
      throw new NotFoundException(
        `Comment with id ${commentId} not found for user ${requesterEmail}`,
      );
    }

    return this.publicationCommentsRepository.deleteComment(
      publicationId,
      commentId,
    );
  }

  public getCommentsCountByUser(email: string) {
    return this.publicationCommentsRepository
      .countCommentsByUser(email)
      .then((result) => ({ result }));
  }
}
