import { PublicationClap } from 'echadospalante-domain';

export interface PublicationClapsRepository {
  countClapsByUser(email: string): Promise<number>;
  deleteClap(publicationId: string, clapId: string): Promise<boolean>;
  save(publicationId: string, userId: string): Promise<PublicationClap>;
  findById(clapId: string): Promise<PublicationClap | null>;
  findByPublicationId(
    publicationId: string,
    skip: number,
    take: number,
  ): Promise<{ items: PublicationClap[]; total: number }>;
}

export const PublicationClapsRepository = Symbol('PublicationClapsRepository');
