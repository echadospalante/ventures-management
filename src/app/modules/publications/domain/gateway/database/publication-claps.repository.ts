import { PublicationClap } from 'echadospalante-core';

export interface PublicationClapsRepository {
  deleteClap(clapId: string): Promise<boolean>;
  save(publicationId: string, authorId: string): Promise<PublicationClap>;
  findById(clapId: string): Promise<PublicationClap | null>;
  findByPublicationId(
    publicationId: string,
    skip: number,
    take: number,
  ): Promise<{ items: PublicationClap[]; total: number }>;
}

export const PublicationClapsRepository = Symbol('PublicationClapsRepository');
