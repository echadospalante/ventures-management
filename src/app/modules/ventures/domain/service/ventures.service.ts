import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VenturesService {
  private readonly logger: Logger = new Logger(VenturesService.name);


   // public constructor(
  //   @Inject(VenturesRepository)
  //   private venturesRepository: VenturesRepository,
  //   @Inject(VentureCategoriesRepository)
  //   private ventureCategoriesRepository: VentureCategoriesRepository,
  //   @Inject(VentureAMQPProducer)
  //   private ventureAMQPProducer: VentureAMQPProducer,
  //   @Inject(UserHttpService)
  //   private userHttpService: UserHttpService,
  //   private cdnService: CdnService,
  // ) {}

  // public getVentures(
  //   filters: VentureFilters,
  //   include: ComplexInclude<Venture>,
  //   pagination: Pagination,
  // ): Promise<Venture[]> {
  //   return this.venturesRepository.findAllByCriteria(
  //     filters,
  //     include,
  //     pagination,
  //   );
  // }

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

  // public async countVentures(
  //   filters: Partial<BasicType<Venture>>,
  // ): Promise<number> {
  //   return this.venturesRepository.countByCriteria(filters);
  // }

  // public async saveVenture(
  //   venture: VentureCreateDto,
  //   coverPhoto: Express.Multer.File,
  // ): Promise<Venture> {
  //   const imageUrl = await this.cdnService.uploadFile(coverPhoto);

  //   const ventureToSave: Venture = await this.buildVentureToSave(
  //     venture,
  //     imageUrl,
  //   );

  //   return this.venturesRepository.save(ventureToSave).then((savedVenture) => {
  //     this.logger.log(`Venture ${ventureToSave.name} saved successfully`);
  //     this.ventureAMQPProducer.emitVentureCreatedEvent(savedVenture);
  //     return savedVenture;
  //   });
  // }

  // private async buildVentureToSave(
  //   venture: VentureCreateDto,
  //   coverPhoto: string,
  // ): Promise<Venture> {
  //   let slug = stringToSlug(venture.name);
  //   const ventureDB = await this.venturesRepository.existBySlug(slug);
  //   if (ventureDB) {
  //     slug = `${slug}-${crypto.randomUUID().substring(0, 8)}`;
  //   }

  //   const categories = await this.ventureCategoriesRepository.findManyById(
  //     venture.categoryIds,
  //     {},
  //   );
  //   const owner = await this.userHttpService.getUserByEmail(venture.ownerEmail);

  //   if (!owner.active) {
  //     throw new NotFoundException('User not found');
  //   }

  //   return {
  //     ...venture,
  //     id: crypto.randomUUID(),
  //     slug,
  //     categories,
  //     coverPhoto,
  //     active: true,
  //     verified: owner.verified,
  //     createdAt: new Date(),
  //   };
  // }

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
}
