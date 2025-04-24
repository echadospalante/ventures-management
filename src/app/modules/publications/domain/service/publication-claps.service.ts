import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PublicationClapsRepository } from '../gateway/database/publication-claps.repository';

@Injectable()
export class PublicationClapsService {
  private readonly logger: Logger = new Logger(PublicationClapsService.name);

  public constructor(
    @Inject(PublicationClapsRepository)
    private readonly publicationCategoriesRepository: PublicationClapsRepository,
  ) {}

  public saveClap(publicationId: string, userId: string) {
    return this.publicationCategoriesRepository.save(publicationId, userId);
  }

  public getPublicationClaps(
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

  public async deleteClap(clapId: string, requestedBy: string) {
    const clap = await this.publicationCategoriesRepository.findById(clapId);
    if (!clap) {
      throw new NotFoundException(`Clap with id ${clapId} not found`);
    }
    if (clap.user.id !== requestedBy) {
      throw new NotFoundException(
        `Clap with id ${clapId} not found for user ${requestedBy}`,
      );
    }

    return this.publicationCategoriesRepository.deleteClap(clapId);
  }
}
