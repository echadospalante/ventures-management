import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  Pagination,
  PublicationCreate,
  VenturePublication,
} from 'echadospalante-domain';

import { VenturesService } from '../../../ventures/domain/service/ventures.service';
import { PublicationFilters } from '../core/publication-filters';
import { PublicationAMQPProducer } from '../gateway/amqp/publication.amqp';
import { PublicationsRepository } from '../gateway/database/publications.repository';
import { UserHttpService } from '../gateway/http/http.gateway';
import { PublicationCategoriesService } from './publication-categories.service';
import { CdnService } from '../../../shared/domain/service/cdn.service';

@Injectable()
export class PublicationsService {
  private readonly logger: Logger = new Logger(PublicationsService.name);

  public constructor(
    @Inject(PublicationsRepository)
    private publicationsRepository: PublicationsRepository,
    private categoriesService: PublicationCategoriesService,
    private venturesService: VenturesService,
    @Inject(PublicationAMQPProducer)
    private publicationAMQPProducer: PublicationAMQPProducer,
    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
    private cdnService: CdnService,
  ) {}

  public async savePublicationCoverPhoto(file: Express.Multer.File) {
    return this.cdnService
      .uploadFile('PUBLICATIONS', file)
      .then((url) => ({ imageUrl: url }));
  }

  public async savePublication(
    publication: PublicationCreate,
    ventureId: string,
    requesterEmail: string,
  ): Promise<VenturePublication> {
    const publicationToSave = await this.buildPublicationToSave(
      publication,
      ventureId,
      requesterEmail,
    );

    return this.publicationsRepository
      .save(publicationToSave, ventureId)
      .then((savedPublication) => {
        this.logger.log(
          `VenturePublication ${publicationToSave.id} saved successfully`,
        );
        this.publicationAMQPProducer.emitVenturePublicationCreatedEvent(
          savedPublication,
        );
        return savedPublication;
      });
  }

  private async buildPublicationToSave(
    publication: PublicationCreate,
    ventureId: string,
    requesterEmail: string,
  ): Promise<VenturePublication> {
    const isOwner = await this.venturesService.isVentureOwner(
      ventureId,
      requesterEmail,
    );

    if (!isOwner) {
      throw new ForbiddenException(
        'El usuario no es el propietario del emprendimiento, no puede crear una publicación',
      );
    }

    const owner = await this.userHttpService.getUserByEmail(requesterEmail);
    if (!owner.active) {
      throw new NotFoundException('User not found');
    }

    const categories = await this.categoriesService.findManyById(
      publication.categoriesIds,
    );

    return {
      id: crypto.randomUUID().toString(),
      description: publication.description,
      active: true,
      claps: [],
      comments: [],
      contents: publication.contents,
      createdAt: new Date(),
      clapsCount: 0,
      commentsCount: 0,
      categories,
    };
  }

  public getVenturePublications(
    ventureId: string,
    filters: PublicationFilters,
    pagination: Pagination,
  ) {
    const { take } = pagination;
    if (take > 100) {
      throw new BadRequestException(
        'La página no debe ser mayor a 100 publicaciones.',
      );
    }
    return this.publicationsRepository.findAllByCriteria(
      filters,
      pagination,
      ventureId,
    );
  }

  public getPublicationsFromAllVentures(
    filters: PublicationFilters,
    pagination: Pagination,
  ) {
    const { take } = pagination;
    if (take > 100) {
      throw new BadRequestException(
        'La página no debe ser mayor a 100 emprendimientos.',
      );
    }
    return this.publicationsRepository.findAllByCriteria(filters, pagination);
  }

  public async deletePublicationById(
    eventId: string,
    email: string,
  ): Promise<void> {
    const isTheOwner = await this.publicationsRepository.isPublicationOwnerById(
      eventId,
      email,
    );
    if (!isTheOwner)
      throw new ForbiddenException('You are not the owner of this event');

    return this.publicationsRepository.deleteById(eventId);
  }
}
