import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MunicipalitiesRepository } from './../../../ventures/domain/gateway/database/municipalities.repository';

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
    @Inject(MunicipalitiesRepository)
    private municipalitiesRepository: MunicipalitiesRepository,
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
    console.log({
      ventureId,
      requesterEmail,
    });

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

    const municipality = await this.municipalitiesRepository.findById(
      event.municipalityId,
    );

    if (!municipality) {
      throw new NotFoundException(
        `Municipality with id ${event.municipalityId} not found`,
      );
    }

    return {
      id: crypto.randomUUID().toString(),
      title: event.title,
      description: event.description,
      slug,
      categories,
      donationsCount: 0,
      totalDonations: 0,
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
          event.locationLat && event.locationLng
            ? {
                type: 'Point',
                coordinates: [+event.locationLng, +event.locationLat],
              }
            : undefined,
        description: event.locationDescription,
        municipality,
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

  public async getHighlightedEvents(
    filters: EventFilters,
    pagination: Pagination,
  ) {
    const events = await this.eventsRepository.findAllByCriteria(
      filters,
      pagination,
    );

    const now = new Date();

    const currentEvents = events.items
      .filter((event) => {
        return event.datesAndHours.some((dateAndHour) => {
          return dateAndHour.workingRanges.some((range) => {
            const [startHour, startMinute] = range.start.split(':').map(Number);
            const [endHour, endMinute] = range.end.split(':').map(Number);

            const start = new Date(dateAndHour.date);
            start.setHours(startHour, startMinute, 0, 0);

            const end = new Date(dateAndHour.date);
            end.setHours(endHour, endMinute, 0, 0);

            return now >= start && now <= end;
          });
        });
      })
      .sort((a, b) => {
        // Ordenar por la fecha más próxima que tenga rangos de trabajo
        const aEarliestDate = a.datesAndHours
          .map((d) => new Date(d.date))
          .sort((x, y) => x.getTime() - y.getTime())[0];

        const bEarliestDate = b.datesAndHours
          .map((d) => new Date(d.date))
          .sort((x, y) => x.getTime() - y.getTime())[0];

        return aEarliestDate.getTime() - bEarliestDate.getTime();
      })
      .slice(0, 10);

    const upcomingEvents = events.items
      .filter((event) => {
        return event.datesAndHours.some((dateAndHour) => {
          return dateAndHour.workingRanges.some((range) => {
            const [startHour, startMinute] = range.start.split(':').map(Number);

            const start = new Date(dateAndHour.date);
            start.setHours(startHour, startMinute, 0, 0);

            return now < start;
          });
        });
      })
      .sort((a, b) => {
        // Encontrar la próxima fecha/hora más cercana para cada evento
        const getNextDateTime = (event: VentureEvent) => {
          const nextTimes: Date[] = [];

          event.datesAndHours.forEach((dateAndHour) => {
            dateAndHour.workingRanges.forEach((range) => {
              const [startHour, startMinute] = range.start
                .split(':')
                .map(Number);
              const start = new Date(dateAndHour.date);
              start.setHours(startHour, startMinute, 0, 0);

              if (start > now) {
                nextTimes.push(start);
              }
            });
          });

          return nextTimes.sort((x, y) => x.getTime() - y.getTime())[0];
        };

        const aNext = getNextDateTime(a);
        const bNext = getNextDateTime(b);

        if (!aNext) return 1;
        if (!bNext) return -1;

        return aNext.getTime() - bNext.getTime();
      })
      .slice(0, 10);

    console.log('Current events found:', currentEvents.length);
    console.log('Upcoming events found:', upcomingEvents.length);

    return {
      current: currentEvents,
      upcoming: upcomingEvents,
    };
  }

  public getEventsCountByUser(email: string) {
    return this.eventsRepository
      .countByUserEmail(email)
      .then((result) => ({ result }));
  }
}
