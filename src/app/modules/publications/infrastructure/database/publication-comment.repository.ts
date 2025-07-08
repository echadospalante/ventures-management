import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PublicationCommentData,
  UserData,
  VenturePublicationData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { DataSource, Repository } from 'typeorm';

import { PublicationCommentsRepository } from '../../domain/gateway/database/publication-comments.repository';
import { PublicationComment } from 'echadospalante-domain';

@Injectable()
export class PublicationCommentsRepositoryImpl
  implements PublicationCommentsRepository
{
  private readonly logger: Logger = new Logger(
    PublicationCommentsRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(PublicationCommentData)
    private publicationCommentsRepository: Repository<PublicationCommentData>,
    private dataSource: DataSource,
  ) {}

  public findById(commentId: string): Promise<PublicationComment | null> {
    return this.publicationCommentsRepository
      .findOne({
        where: { id: commentId },
      })
      .then((comment) => {
        if (!comment) {
          return null;
        }
        return JSON.parse(JSON.stringify(comment)) as PublicationComment;
      });
  }

  public deleteComment(
    publicationId: string,
    commentId: string,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner
      .connect()
      .then(() => queryRunner.startTransaction())
      .then(() =>
        queryRunner.manager
          .findOne(PublicationCommentData, { where: { id: commentId } })
          .then((comment) => {
            if (!comment) {
              throw new Error(`Comment with id ${commentId} not found`);
            }
            return queryRunner.manager.remove(comment);
          }),
      )
      .then(() =>
        queryRunner.manager.decrement(
          VenturePublicationData,
          { id: publicationId },
          'commentsCount',
          1,
        ),
      )
      .then(() => queryRunner.commitTransaction())
      .then(() => true)
      .catch((error) => {
        this.logger.error(
          'Error deleting comment with transaction',
          error.stack,
        );
        return queryRunner.rollbackTransaction().then(() => false);
      })
      .finally(() => queryRunner.release());
  }

  public async save(
    publicationId: string,
    authorId: string,
    content: string,
  ): Promise<PublicationComment> {
    console.log({
      publicationId,
      authorId,
      content,
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newComment = queryRunner.manager.create(PublicationCommentData, {
        publication: { id: publicationId } as VenturePublicationData,
        author: { id: authorId } as UserData,
        content,
      });

      const savedComment = await queryRunner.manager.save(newComment);

      await queryRunner.manager.increment(
        VenturePublicationData,
        { id: publicationId },
        'commentsCount',
        1,
      );

      await queryRunner.commitTransaction();

      return JSON.parse(JSON.stringify(savedComment)) as PublicationComment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error saving comment with transaction', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public findByPublicationId(
    publicationId: string,
    skip: number,
    take: number,
  ): Promise<{ items: PublicationComment[]; total: number }> {
    return this.publicationCommentsRepository
      .createQueryBuilder('publicationComment')
      .leftJoinAndSelect('publicationComment.author', 'author')
      .where('publicationComment.publicationId = :publicationId', {
        publicationId,
      })
      .skip(skip)
      .take(take)
      .getManyAndCount()
      .then(([items, total]) => ({
        items: JSON.parse(JSON.stringify(items)) as PublicationComment[],
        total,
      }));
  }
}
