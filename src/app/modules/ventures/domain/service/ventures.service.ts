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

  public countVentures(filters: VentureFilters): Promise<number> {
    return this.venturesRepository.countByCriteria(filters);
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
  /*

  public getOwnedVentures(filters: OwnedVentureFilters): Promise<Venture[]> {
    return this.venturesRepository.findOwnedVentures(filters);
  }

  public async getVentureBySlug(slug: string): Promise<Venture> {
    const ventureDetail = await this.venturesRepository.findBySlug(slug, {
      categories: true,
      contact: true,
      detail: true,
      location: true,
      ownerDetail: true,
    });

    if (!ventureDetail) throw new NotFoundException('Venture not found');

    return ventureDetail;
  }

  

  // public async getVentureById(ventureId: string): Promise<Venture> {
  //   const venture = await this.venturesRepository.findById(ventureId, {
  //     categories: true,
  //     detail: false,
  //     owner: true,
  //   });
  //   if (!venture) throw new NotFoundException('Venture not found');
  //   return venture;
  // }

  // public async getVentureBySlug(slug: string): Promise<Venture> {
  //   const venture = await this.venturesRepository.findBySlug(slug, {});
  //   if (!venture) throw new NotFoundException('Venture not found');
  //   return venture;
  // }


  public countOwnedVentures(filters: OwnedVentureFilters): Promise<number> {
    return this.venturesRepository.countOwnedVentures(filters);
  }

  

  // public async enableVenture(ventureId: string): Promise<Venture | null> {
  //   const venture = await this.venturesRepository.findById(ventureId, {
  //     roles: true,
  //   });
  //   if (!venture) {
  //     throw new NotFoundException('Venture not found');
  //   }
  //   if (venture.active) {
  //     throw new BadRequestException('Venture is already enabled');
  //   }

  //   return this.venturesRepository
  //     .unlockAccount(venture.email)
  //     .then((ventureDB) => {
  //       if (!ventureDB) {
  //         throw new BadRequestException('Venture could not be enabled');
  //       }
  //       this.ventureAMQPProducer.emitVentureEnabledEvent(ventureDB);
  //       return ventureDB;
  //     });
  // }

  // public async disableVenture(ventureId: string): Promise<Venture | null> {
  //   const venture = await this.venturesRepository.findById(ventureId, {
  //     roles: true,
  //   });
  //   if (!venture) throw new NotFoundException('Venture not found');

  //   if (!venture.active)
  //     throw new BadRequestException('Venture is already disabled');

  //   const isAdmin = venture.roles.some(({ name }) => name === AppRole.ADMIN);
  //   if (isAdmin)
  //     throw new ForbiddenException('Admin venture cannot be disabled');

  //   return this.venturesRepository
  //     .lockAccount(venture.email)
  //     .then((ventureDB) => {
  //       if (!ventureDB) {
  //         throw new BadRequestException('Venture could not be disabled');
  //       }
  //       this.ventureAMQPProducer.emitVentureDisabledEvent(ventureDB);
  //       return ventureDB;
  //     });
  // }

  // public async verifyVenture(email: string): Promise<Venture | null> {
  //   const venture = await this.venturesRepository.findById(email, {});
  //   if (!venture) throw new NotFoundException('Venture not found');

  //   if (venture.verified)
  //     throw new BadRequestException('Venture is already verified');

  //   return this.venturesRepository
  //     .verifyAccount(venture.email)
  //     .then((ventureDB) => {
  //       if (!ventureDB) {
  //         throw new BadRequestException('Venture could not be verified');
  //       }
  //       this.ventureAMQPProducer.emitVentureVerifiedEvent(ventureDB);
  //       return ventureDB;
  //     });
  // }

  // public async unverifyVenture(email: string): Promise<Venture | null> {
  //   const venture = await this.venturesRepository.findById(email, {
  //     roles: true,
  //   });
  //   if (!venture) throw new NotFoundException('Venture not found');
  //   console.log({ USER: venture });
  //   if (!venture.verified)
  //     throw new BadRequestException('Venture is already unverified');

  //   const isAdmin = venture.roles.some(({ name }) => name === AppRole.ADMIN);
  //   if (isAdmin)
  //     throw new ForbiddenException('Admin venture cannot be unverified');

  //   return this.venturesRepository
  //     .unverifyAccount(venture.email)
  //     .then((ventureDB) => {
  //       if (!ventureDB) {
  //         throw new BadRequestException('Venture could not be unverified');
  //       }
  //       this.ventureAMQPProducer.emitVentureUnverifiedEvent(ventureDB);
  //       return ventureDB;
  //     });
  // }

  // public async updateVentureImage(
  //   ventureId: string,
  //   image: { buffer: Buffer; mimetype: string },
  // ): Promise<void> {
  //   return Promise.resolve();
  // const venturesCache = await this.venturesCache.getMany('betting_house_*');
  // const venture = venturesCache.find(({ id }) => {
  //   return id === ventureId;
  // });
  // if (!venture) {
  //   throw new ConflictException('Betting house does not exists');
  // }
  // const { fullName } = venture;
  // this.deleteVentureImage(fullName);
  // const format = image.mimetype.split('/')[1];
  // const imagePath = `${this.BETTING_HOUSES_IMAGES_FOLDER}/${fullName}.${format}`;
  // mkdirSync(`${this.BETTING_HOUSES_IMAGES_FOLDER}`, { recursive: true });
  // writeFileSync(`${imagePath}`, image.buffer);
  // }

  // public deleteVentureByEmail(email: string): Promise<void> {
  //   return this.venturesRepository.deleteByEmail(email);
  // }

  // public getVenturePreferences(ventureId: string) {
  //   return this.venturesRepository
  //     .findById(ventureId, {
  //       preferences: true,
  //     })
  //     .then((venture) => {
  //       if (!venture) throw new NotFoundException('Venture not found');
  //       return venture.preferences;
  //     });
  // }

  // public getRoles() {
  //   return this.ventureCategoriesRepository.findAll({});
  // }

  // public async updateRolesToVenture(
  //   email: string,
  //   roles: AppRole[],
  // ): Promise<void> {
  //   const venture = await this.venturesRepository.findById(email, {
  //     roles: true,
  //   });
  //   if (!venture) throw new NotFoundException('Venture not found');
  //   if (roles.includes(AppRole.ADMIN) || roles.includes(AppRole.USER))
  //     throw new BadRequestException('Admin or venture role cannot be added');
  //   const baseRoles = venture.roles.filter(
  //     ({ name }) => name === AppRole.ADMIN || name === AppRole.USER,
  //   );
  //   const addedRoles = roles.filter(
  //     (role) => !venture.roles.some(({ name }) => name === role),
  //   );
  //   const removedRoles = venture.roles
  //     .map(({ name }) => name)
  //     .filter((role) => !baseRoles.some(({ name }) => role === name))
  //     .filter((role) => !roles.some((name) => role === name));

  //   const rolesToAdd =
  //     await this.ventureCategoriesRepository.findManyByName(addedRoles);
  //   const rolesToRemove =
  //     await this.ventureCategoriesRepository.findManyByName(removedRoles);

  //   return Promise.all([
  //     this.venturesRepository.addVentureRoles(email, rolesToAdd),
  //     this.venturesRepository.removeVentureRoles(email, rolesToRemove),
  //   ]).then(() => {
  //     this.logger.log(`Roles updated for venture ${email}`);
  //     this.ventureAMQPProducer.emitVentureUpdatedEvent(venture);
  //   });
  // }
  */
}
