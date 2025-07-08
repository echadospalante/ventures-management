import { PublicationComment } from 'echadospalante-domain';

export interface PublicationCommentsRepository {
  deleteComment(publicationId: string, commentId: string): Promise<boolean>;
  save(
    publicationId: string,
    authorId: string,
    content: string,
  ): Promise<PublicationComment>;
  findById(commentId: string): Promise<PublicationComment | null>;
  findByPublicationId(
    publicationId: string,
    skip: number,
    take: number,
  ): Promise<{ items: PublicationComment[]; total: number }>;
}

export const PublicationCommentsRepository = Symbol(
  'PublicationCommentsRepository',
);
