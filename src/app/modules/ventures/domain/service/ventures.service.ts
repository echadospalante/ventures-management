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
  Venture,
  VentureCreate,
  VentureUpdate,
} from 'echadospalante-domain';

import { stringToSlug } from '../../../../helpers/functions/slug-generator';
import { CdnService } from '../../../shared/domain/service/cdn.service';
import { VentureFilters } from '../core/venture-filters';
import { VentureAMQPProducer } from '../gateway/amqp/venture.amqp';
import { MunicipalitiesRepository } from '../gateway/database/municipalities.repository';
import { VentureCategoriesRepository } from '../gateway/database/venture-categories.repository';
import { VenturesRepository } from '../gateway/database/ventures.repository';
import { UserHttpService } from '../gateway/http/http.gateway';

@Injectable()
export class VenturesService {
  private readonly logger: Logger = new Logger(VenturesService.name);

  public constructor(
    @Inject(VenturesRepository)
    private venturesRepository: VenturesRepository,
    @Inject(VentureCategoriesRepository)
    private ventureCategoriesRepository: VentureCategoriesRepository,
    @Inject(MunicipalitiesRepository)
    private municipalitiesRepository: MunicipalitiesRepository,
    @Inject(VentureAMQPProducer)
    private ventureAMQPProducer: VentureAMQPProducer,
    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
    private cdnService: CdnService,
  ) {}

  public async saveVentureCoverPhoto(file: Express.Multer.File) {
    return this.cdnService
      .uploadFile('VENTURES', file)
      .then((url) => ({ imageUrl: url }));
  }

  public async saveVenture(
    venture: VentureCreate,
    ownerEmail: string,
  ): Promise<Venture> {
    const ventureToSave = await this.buildVentureToSave(venture, ownerEmail);

    return this.venturesRepository.save(ventureToSave).then((savedVenture) => {
      this.logger.log(`Venture ${ventureToSave.name} saved successfully`);
      this.ventureAMQPProducer.emitVentureCreatedEvent(savedVenture);
      return savedVenture;
    });
  }

  public async updateVenture(
    id: string,
    ownerId: string,
    ventureUpdate: VentureUpdate,
  ) {
    const ventureDB = await this.venturesRepository.findById(id);
    if (!ventureDB)
      throw new NotFoundException(`Emprendimiento con id ${id} no encontrado`);

    const ventureToUpdate = await this.buildVentureToUpdate(
      id,
      ownerId,
      ventureDB,
      ventureUpdate,
    );

    return this.venturesRepository
      .save(ventureToUpdate)
      .then((savedVenture) => {
        this.logger.log(`Venture ${ventureToUpdate.name} saved successfully`);
        this.ventureAMQPProducer.emitVentureCreatedEvent(savedVenture);
        return savedVenture;
      });
  }

  public isVentureOwner(
    ventureId: string,
    requesterEmail: string,
  ): Promise<boolean> {
    return this.venturesRepository.isVentureOwner(ventureId, requesterEmail);
  }

  private async buildVentureToSave(
    venture: VentureCreate,
    ownerEmail: string,
  ): Promise<Venture> {
    let slug = stringToSlug(venture.name);
    const ventureDB = await this.venturesRepository.existsBySlug(slug);
    if (ventureDB) {
      slug = `${slug}-${crypto.randomUUID().substring(0, 8)}`;
    }

    const categories = await this.ventureCategoriesRepository.findManyById(
      venture.categoriesIds,
    );

    const municipality = await this.municipalitiesRepository.findById(
      venture.location!.municipalityId!,
    );

    if (!municipality) {
      throw new NotFoundException(
        `Municipality with id ${venture.location!.municipalityId} not found`,
      );
    }

    const [owner] = await Promise.all([
      this.userHttpService.getUserByEmail(ownerEmail),
    ]);
    if (!owner.active) {
      throw new NotFoundException('User not found');
    }

    return {
      ...venture,
      id: crypto.randomUUID().toString(),
      slug,
      categories,
      coverPhoto: venture.coverPhoto,
      active: true,
      verified: owner.verified,
      subscriptionsCount: 0,
      owner,
      createdAt: new Date(),
      updatedAt: new Date(),
      // TODO: Traer el id del registro actual para que en lugar de generar un nuevo registro, lo actualice
      contact: {
        id: crypto.randomUUID().toString(),
        email: venture.contact?.email || '',
        phoneNumber: venture.contact?.phoneNumber || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // TODO: Traer el id del registro actual para que en lugar de generar un nuevo registro, lo actualice
      location: {
        id: crypto.randomUUID().toString(),
        municipality,
        location:
          venture.location?.lat && venture.location?.lng
            ? {
                type: 'Point',
                coordinates: [venture.location.lng, venture.location.lat],
              }
            : undefined,
        description: venture.location?.description || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      events: [],
      sponsorships: [],
      subscriptions: [],
      publications: [],
    };
  }

  private async buildVentureToUpdate(
    id: string,
    ownerId: string,
    ventureDB: Venture,
    ventureUpdate: VentureUpdate,
  ): Promise<Venture> {
    const categories = await this.ventureCategoriesRepository.findManyById(
      ventureUpdate.categoriesIds,
    );
    const slug = stringToSlug(ventureDB.name);

    const [owner] = await Promise.all([
      this.userHttpService.getUserById(ownerId),
    ]);
    if (!owner.active) {
      throw new NotFoundException('User not found');
    }

    // TODO: Arreglar esto
    const municipality = await this.municipalitiesRepository.findById(
      ventureDB.location?.municipality.id || 0,
    );

    if (!municipality) {
      throw new NotFoundException(`Municipality not found`);
    }

    return {
      ...ventureDB,
      id,
      slug,
      categories,
      coverPhoto: ventureUpdate.coverPhoto || ventureDB.coverPhoto,
      active: true,
      verified: owner.verified,
      owner,
      createdAt: new Date(),
      updatedAt: new Date(),
      contact: {
        ...ventureDB.contact,
        id: crypto.randomUUID(),
        email: ventureUpdate.contact?.email || ventureDB.contact?.email || '',
        phoneNumber:
          ventureUpdate.contact?.phoneNumber ||
          ventureDB.contact?.phoneNumber ||
          '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      location: {
        municipality,
        location:
          ventureUpdate.location?.lat && ventureUpdate.location?.lng
            ? {
                type: 'Point',
                coordinates: [
                  ventureUpdate.location.lng,
                  ventureUpdate.location.lat,
                ],
              }
            : ventureDB.location?.location,
        description: ventureDB.location?.description || '',
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  public getVentures(filters: VentureFilters, pagination: Pagination) {
    const { take } = pagination;
    if (take > 100) {
      throw new BadRequestException(
        'La página no debe ser mayor a 100 emprendimientos.',
      );
    }
    return this.venturesRepository.findAllByCriteria(filters, pagination);
  }

  public getOwnedVentures(filters: VentureFilters, pagination: Pagination) {
    return this.venturesRepository.findAllByCriteria(filters, pagination);
  }

  public getVenturesForMap(filters: VentureFilters) {
    const { municipalitiesIds } = filters;
    if (municipalitiesIds.length !== 1) {
      throw new BadRequestException(
        'Debe seleccionar un único municipio para mostrar los emprendimientos en el mapa.',
      );
    }
    return this.venturesRepository.findAllByCriteria(filters);
  }

  public async deleteVentureById(
    ventureId: string,
    email: string,
  ): Promise<void> {
    const isTheOwner = await this.venturesRepository.isVentureOwnerByEmail(
      ventureId,
      email,
    );
    if (!isTheOwner)
      throw new ForbiddenException('You are not the owner of this venture');

    return this.venturesRepository.deleteById(ventureId);
  }

  public async getRandomVenture() {
    return this.venturesRepository.findRandomVenture();
  }

  public getVenturesStats(ventureId: string) {
    return this.venturesRepository.getVenturesStats(ventureId);
  }

  public getVentureDetail(ventureId: string) {
    return this.venturesRepository.findById(ventureId);
  }
  public getVentureDetailBySlug(ventureSlug: string) {
    return this.venturesRepository.findBySlug(ventureSlug);
  }
}
