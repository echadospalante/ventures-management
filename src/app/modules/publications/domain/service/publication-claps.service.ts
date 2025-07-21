import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PublicationClapsRepository } from '../gateway/database/publication-claps.repository';
import { UserHttpService } from '../gateway/http/http.gateway';

@Injectable()
export class PublicationClapsService {
  private readonly logger: Logger = new Logger(PublicationClapsService.name);

  public constructor(
    @Inject(PublicationClapsRepository)
    private readonly publicationClapsRepository: PublicationClapsRepository,
    @Inject(UserHttpService)
    private readonly userHttpService: UserHttpService,
  ) {}

  public getClapsCountByUser(email: string) {
    return this.publicationClapsRepository
      .countClapsByUser(email)
      .then((result) => ({ result }));
  }

  public async saveClap(publicationId: string, authorEmail: string) {
    const author = await this.userHttpService.getUserByEmail(authorEmail);
    console.log({
      author,
    });
    return this.publicationClapsRepository.save(publicationId, author.id);
  }

  public getPublicationClaps(
    publicationId: string,
    skip: number,
    take: number,
  ) {
    return this.publicationClapsRepository.findByPublicationId(
      publicationId,
      skip,
      take,
    );
  }

  public async deleteClap(
    publicationId: string,
    clapId: string,
    requesterEmail: string,
  ) {
    const clap = await this.publicationClapsRepository.findById(clapId);
    if (!clap) {
      console.log('Clap not found:', clapId);
      throw new NotFoundException(`Clap with id ${clapId} not found`);
    }

    if (clap.user.email !== requesterEmail) {
      console.log(
        `User ${requesterEmail} is not authorized to delete clap ${clapId}`,
      );
      throw new NotFoundException(
        `Clap with id ${clapId} not found for user ${requesterEmail}`,
      );
    }

    return this.publicationClapsRepository.deleteClap(publicationId, clapId);
  }
}
