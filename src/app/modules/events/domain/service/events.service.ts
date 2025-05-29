import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  EventCreate,
  EventUpdate,
  Pagination,
  VentureEvent,
} from 'echadospalante-domain';

import { stringToSlug } from '../../../../helpers/functions/slug-generator';
import { VenturesService } from '../../../ventures/domain/service/ventures.service';
import { EventFilters } from '../core/event-filters';
import { EventAMQPProducer } from '../gateway/amqp/event.amqp';
import { EventsRepository } from '../gateway/database/events.repository';
import { UserHttpService } from '../gateway/http/http.gateway';
import { EventCategoriesService } from './event-categories.service';
import { CdnService } from '../../../shared/domain/service/cdn.service';

@Injectable()
export class EventsService {
  private readonly logger: Logger = new Logger(EventsService.name);

  public constructor(
    @Inject(EventsRepository)
    private eventsRepository: EventsRepository,
    private categoriesService: EventCategoriesService,
    private venturesService: VenturesService,
    @Inject(EventAMQPProducer)
    private eventAMQPProducer: EventAMQPProducer,
    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
    private cdnService: CdnService,
  ) {}

  public async saveEventCoverPhoto(file: Express.Multer.File) {
    return this.cdnService
      .uploadFile('EVENTS', file)
      .then((url) => ({ imageUrl: url }));
  }

  public async saveEvent(
    event: EventCreate,
    ventureId: string,
    ownerId: string,
  ): Promise<VentureEvent> {
    const eventToSave = await this.buildEventToSave(event, ventureId, ownerId);

    return this.eventsRepository
      .save(eventToSave, ventureId)
      .then((savedEvent) => {
        this.logger.log(`VentureEvent ${eventToSave.title} saved successfully`);
        this.eventAMQPProducer.emitVentureEventCreatedEvent(savedEvent);
        return savedEvent;
      });
  }

  public async updateEvent(
    id: string,
    requesterEmail: string,
    eventUpdate: EventUpdate,
  ) {
    const eventDB = await this.eventsRepository.findById(id);
    if (!eventDB)
      throw new NotFoundException(`Emprendimiento con id ${id} no encontrado`);

    const eventToUpdate = await this.buildEventToUpdate(
      id,
      requesterEmail,
      eventDB,
      eventUpdate,
    );

    return this.eventsRepository.save(eventToUpdate, '').then((savedEvent) => {
      this.logger.log(`VentureEvent ${eventToUpdate.title} saved successfully`);
      this.eventAMQPProducer.emitVentureEventCreatedEvent(savedEvent);
      return savedEvent;
    });
  }

  private async buildEventToSave(
    event: EventCreate,
    ventureId: string,
    requesterEmail: string,
  ): Promise<VentureEvent> {
    let slug = stringToSlug(event.title);
    const eventDB = await this.eventsRepository.existsBySlug(slug);
    if (eventDB) {
      slug = `${slug}-${crypto.randomUUID().substring(0, 8)}`;
    }

    const isOwner = await this.venturesService.isVentureOwner(
      ventureId,
      requesterEmail,
    );

    if (!isOwner) {
      throw new ForbiddenException(
        'El usuario no es el propietario del emprendimiento, no puede crear un evento',
      );
    }

    const categories = await this.categoriesService.findManyById(
      event.categoriesIds,
    );

    const owner = await this.userHttpService.getUserByEmail(requesterEmail);

    if (!owner.active) {
      throw new NotFoundException('User not found');
    }

    return {
      id: crypto.randomUUID().toString(),
      title: event.title,
      description: event.description,
      slug,
      categories,
      coverPhoto: event.coverPhoto,
      donations: [],
      datesAndHours: event.datesAndHours.map((dateAndHour) => ({
        date: dateAndHour.date,
        workingRanges: dateAndHour.workingRanges.map((range) => ({
          start: range.start,
          end: range.end,
        })),
      })),
      location: {
        id: crypto.randomUUID().toString(),
        location:
          event.location?.lat && event.location?.lng
            ? {
                type: 'Point',
                coordinates: [event.location.lng, event.location.lat],
              }
            : undefined,
        description: event.location?.description,
      },
      contact: {
        id: crypto.randomUUID().toString(),
        email: event.contactEmail,
        phoneNumber: event.contactPhoneNumber,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private async buildEventToUpdate(
    id: string,
    requesterEmail: string,
    eventDB: VentureEvent,
    eventUpdate: EventUpdate,
  ): Promise<VentureEvent> {
    const categories = await this.categoriesService.findManyById(
      eventUpdate.categoriesIds,
    );
    const slug = stringToSlug(eventDB.title);

    const [owner] = await Promise.all([
      this.userHttpService.getUserByEmail(requesterEmail),
    ]);
    if (!owner.active) {
      throw new NotFoundException('User not found');
    }

    return {
      ...eventDB,
      id,
      slug,
      categories,
      coverPhoto: eventUpdate.coverPhoto || eventDB.coverPhoto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public getVentureEvents(
    ventureId: string,
    filters: EventFilters,
    pagination: Pagination,
  ) {
    const { take } = pagination;
    if (take > 100) {
      throw new BadRequestException(
        'La página no debe ser mayor a 100 emprendimientos.',
      );
    }
    return this.eventsRepository.findAllByCriteria(
      filters,
      pagination,
      ventureId,
    );
  }

  public getEventsFromAllVentures(
    filters: EventFilters,
    pagination: Pagination,
  ) {
    const { take } = pagination;
    if (take > 100) {
      throw new BadRequestException(
        'La página no debe ser mayor a 100 emprendimientos.',
      );
    }
    return this.eventsRepository.findAllByCriteria(filters, pagination);
  }

  public async deleteEventById(eventId: string, userId: string): Promise<void> {
    const isTheOwner = await this.eventsRepository.isEventOwnerById(
      eventId,
      userId,
    );
    if (!isTheOwner)
      throw new ForbiddenException('You are not the owner of this event');

    return this.eventsRepository.deleteById(eventId);
  }
  /*

  public getOwnedEvents(filters: OwnedEventFilters): Promise<VentureEvent[]> {
    return this.eventsRepository.findOwnedEvents(filters);
  }

  public async getEventBySlug(slug: string): Promise<VentureEvent> {
    const eventDetail = await this.eventsRepository.findBySlug(slug, {
      categories: true,
      contact: true,
      detail: true,
      location: true,
      ownerDetail: true,
    });

    if (!eventDetail) throw new NotFoundException('VentureEvent not found');

    return eventDetail;
  }

  

  // public async getEventById(eventId: string): Promise<VentureEvent> {
  //   const event = await this.eventsRepository.findById(eventId, {
  //     categories: true,
  //     detail: false,
  //     owner: true,
  //   });
  //   if (!event) throw new NotFoundException('VentureEvent not found');
  //   return event;
  // }

  // public async getEventBySlug(slug: string): Promise<VentureEvent> {
  //   const event = await this.eventsRepository.findBySlug(slug, {});
  //   if (!event) throw new NotFoundException('VentureEvent not found');
  //   return event;
  // }


  public countOwnedEvents(filters: OwnedEventFilters): Promise<number> {
    return this.eventsRepository.countOwnedEvents(filters);
  }

  

  // public async enableEvent(eventId: string): Promise<VentureEvent | null> {
  //   const event = await this.eventsRepository.findById(eventId, {
  //     roles: true,
  //   });
  //   if (!event) {
  //     throw new NotFoundException('VentureEvent not found');
  //   }
  //   if (event.active) {
  //     throw new BadRequestException('VentureEvent is already enabled');
  //   }

  //   return this.eventsRepository
  //     .unlockAccount(event.email)
  //     .then((eventDB) => {
  //       if (!eventDB) {
  //         throw new BadRequestException('VentureEvent could not be enabled');
  //       }
  //       this.eventAMQPProducer.emitVentureEventEnabledEvent(eventDB);
  //       return eventDB;
  //     });
  // }

  // public async disableEvent(eventId: string): Promise<VentureEvent | null> {
  //   const event = await this.eventsRepository.findById(eventId, {
  //     roles: true,
  //   });
  //   if (!event) throw new NotFoundException('VentureEvent not found');

  //   if (!event.active)
  //     throw new BadRequestException('VentureEvent is already disabled');

  //   const isAdmin = event.roles.some(({ name }) => name === AppRole.ADMIN);
  //   if (isAdmin)
  //     throw new ForbiddenException('Admin event cannot be disabled');

  //   return this.eventsRepository
  //     .lockAccount(event.email)
  //     .then((eventDB) => {
  //       if (!eventDB) {
  //         throw new BadRequestException('VentureEvent could not be disabled');
  //       }
  //       this.eventAMQPProducer.emitVentureEventDisabledEvent(eventDB);
  //       return eventDB;
  //     });
  // }

  // public async verifyEvent(email: string): Promise<VentureEvent | null> {
  //   const event = await this.eventsRepository.findById(email, {});
  //   if (!event) throw new NotFoundException('VentureEvent not found');

  //   if (event.verified)
  //     throw new BadRequestException('VentureEvent is already verified');

  //   return this.eventsRepository
  //     .verifyAccount(event.email)
  //     .then((eventDB) => {
  //       if (!eventDB) {
  //         throw new BadRequestException('VentureEvent could not be verified');
  //       }
  //       this.eventAMQPProducer.emitVentureEventVerifiedEvent(eventDB);
  //       return eventDB;
  //     });
  // }

  // public async unverifyEvent(email: string): Promise<VentureEvent | null> {
  //   const event = await this.eventsRepository.findById(email, {
  //     roles: true,
  //   });
  //   if (!event) throw new NotFoundException('VentureEvent not found');
  //   console.log({ USER: event });
  //   if (!event.verified)
  //     throw new BadRequestException('VentureEvent is already unverified');

  //   const isAdmin = event.roles.some(({ name }) => name === AppRole.ADMIN);
  //   if (isAdmin)
  //     throw new ForbiddenException('Admin event cannot be unverified');

  //   return this.eventsRepository
  //     .unverifyAccount(event.email)
  //     .then((eventDB) => {
  //       if (!eventDB) {
  //         throw new BadRequestException('VentureEvent could not be unverified');
  //       }
  //       this.eventAMQPProducer.emitVentureEventUnverifiedEvent(eventDB);
  //       return eventDB;
  //     });
  // }

  // public async updateEventImage(
  //   eventId: string,
  //   image: { buffer: Buffer; mimetype: string },
  // ): Promise<void> {
  //   return Promise.resolve();
  // const eventsCache = await this.eventsCache.getMany('betting_house_*');
  // const event = eventsCache.find(({ id }) => {
  //   return id === eventId;
  // });
  // if (!event) {
  //   throw new ConflictException('Betting house does not exists');
  // }
  // const { fullName } = event;
  // this.deleteEventImage(fullName);
  // const format = image.mimetype.split('/')[1];
  // const imagePath = `${this.BETTING_HOUSES_IMAGES_FOLDER}/${fullName}.${format}`;
  // mkdirSync(`${this.BETTING_HOUSES_IMAGES_FOLDER}`, { recursive: true });
  // writeFileSync(`${imagePath}`, image.buffer);
  // }

  // public deleteEventByEmail(email: string): Promise<void> {
  //   return this.eventsRepository.deleteByEmail(email);
  // }

  // public getEventPreferences(eventId: string) {
  //   return this.eventsRepository
  //     .findById(eventId, {
  //       preferences: true,
  //     })
  //     .then((event) => {
  //       if (!event) throw new NotFoundException('VentureEvent not found');
  //       return event.preferences;
  //     });
  // }

  // public getRoles() {
  //   return this.eventCategoriesRepository.findAll({});
  // }

  // public async updateRolesToEvent(
  //   email: string,
  //   roles: AppRole[],
  // ): Promise<void> {
  //   const event = await this.eventsRepository.findById(email, {
  //     roles: true,
  //   });
  //   if (!event) throw new NotFoundException('VentureEvent not found');
  //   if (roles.includes(AppRole.ADMIN) || roles.includes(AppRole.USER))
  //     throw new BadRequestException('Admin or event role cannot be added');
  //   const baseRoles = event.roles.filter(
  //     ({ name }) => name === AppRole.ADMIN || name === AppRole.USER,
  //   );
  //   const addedRoles = roles.filter(
  //     (role) => !event.roles.some(({ name }) => name === role),
  //   );
  //   const removedRoles = event.roles
  //     .map(({ name }) => name)
  //     .filter((role) => !baseRoles.some(({ name }) => role === name))
  //     .filter((role) => !roles.some((name) => role === name));

  //   const rolesToAdd =
  //     await this.eventCategoriesRepository.findManyByName(addedRoles);
  //   const rolesToRemove =
  //     await this.eventCategoriesRepository.findManyByName(removedRoles);

  //   return Promise.all([
  //     this.eventsRepository.addEventRoles(email, rolesToAdd),
  //     this.eventsRepository.removeEventRoles(email, rolesToRemove),
  //   ]).then(() => {
  //     this.logger.log(`Roles updated for event ${email}`);
  //     this.eventAMQPProducer.emitVentureEventUpdatedEvent(event);
  //   });
  // }
  */
}
