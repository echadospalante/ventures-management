import { Inject, Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker/locale/es';
import { EventCreate } from 'echadospalante-domain';
import { DatesAndHour } from 'echadospalante-domain/dist/app/modules/domain/events/event';

import { VenturesService } from '../../../ventures/domain/service/ventures.service';
import { UserHttpService } from '../gateway/http/http.gateway';
import { EventCategoriesService } from './event-categories.service';
import { EventsService } from './events.service';

@Injectable()
export class SeedService {
  public constructor(
    private eventCategoriesService: EventCategoriesService,
    private eventsService: EventsService,
    private venturesService: VenturesService,

    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
  ) {}

  getRandomColombiaCoordinatesLand() {
    const bounds = {
      north: 12.0,
      south: -3.5,
      east: -67.5,
      west: -79.0,
    };

    const lat = Math.random() * (bounds.north - bounds.south) + bounds.south;
    const lng = Math.random() * (bounds.east - bounds.west) + bounds.west;

    return {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    };
  }

  public async seedEvents(amount: number) {
    const categories = await this.eventCategoriesService.getEventCategories({});
    const batchSize = 50; // Change to 10 or 100 for larger batches
    for await (const _ of Array(amount).keys()) {
      const randomVenture = await this.venturesService.getRandomVenture();
      console.log(`Seeding event: `, (_ + 1) * batchSize);
      if (!randomVenture) continue;
      const { lat, lng } = this.getRandomColombiaCoordinatesLand();
      const arr = Array.from({ length: batchSize });
      await Promise.all(
        arr.map(() => {
          const eventCreate: EventCreate = {
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(1),
            coverPhoto: faker.image.urlLoremFlickr({
              category: 'business',
              width: 800,
              height: 600,
            }),
            categoriesIds: categories
              .slice(
                0,
                faker.number.int({
                  min: 1,
                  max: categories.length,
                }),
              )
              .map(({ id }) => id),
            contactEmail: faker.internet.email(),
            contactPhoneNumber: faker.phone.number({
              style: 'international',
            }),
            locationLat: lat + '',
            locationLng: lng + '',
            datesAndHours: this.getRandomDatesAndHours(),
            locationDescription: faker.location.streetAddress({}),
            municipalityId: faker.number.int({ min: 733, max: 1232 }),
          };
          return this.eventsService.saveEvent(
            eventCreate,
            randomVenture.id,
            randomVenture.owner!.email,
          );
        }),
      );
    }
  }
  private getRandomDatesAndHours(): DatesAndHour[] {
    return Array(faker.number.int({ min: 1, max: 5 }))
      .fill(null)
      .map(() => ({
        date: faker.date.future().toISOString(),
        workingRanges: Array(faker.number.int({ min: 1, max: 3 }))
          .fill(null)
          .map(() => {
            const start = this.getRandomTime(20);
            const end = this.getRandomTime(+start.split(':')[0]);
            return {
              start,
              end,
            };
          }),
      }));
  }

  private getRandomTime(afterHour: number): string {
    const hours = faker.number.int({ min: 0, max: 20 });
    const minutes = faker.number.int({ min: 0, max: 59 });
    if (afterHour && hours >= afterHour) {
      return this.getRandomTime(afterHour);
    }
    return `${hours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
