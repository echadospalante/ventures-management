import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PublicationCommentsRepository } from '../gateway/database/publication-comments.repository';

@Injectable()
export class PublicationCommentsService {
  private readonly logger: Logger = new Logger(PublicationCommentsService.name);

  public constructor(
    @Inject(PublicationCommentsRepository)
    private readonly publicationCategoriesRepository: PublicationCommentsRepository,
  ) {}

  public saveComment(publicationId: string, userId: string, comment: string) {
    return this.publicationCategoriesRepository.save(
      publicationId,
      userId,
      comment,
    );
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
