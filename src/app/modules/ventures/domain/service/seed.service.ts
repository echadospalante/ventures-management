import { Inject, Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker/locale/es';
import { User, VentureCreate } from 'echadospalante-domain';

import { UserHttpService } from '../gateway/http/http.gateway';
import { VenturesService } from '../service/ventures.service';
import { VentureCategoriesService } from './venture-categories.service';

interface Coordinates {
  lat: number;
  lng: number;
  city: string;
}

interface CityBounds {
  name: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

@Injectable()
export class SeedService {
  public constructor(
    private ventureCategoriesService: VentureCategoriesService,
    private venturesService: VenturesService,
    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
  ) {}

  getRandomColombianCoordinates(): Coordinates {
    // Principales ciudades y municipios de Colombia con sus límites aproximados
    const cities: CityBounds[] = [
      // Bogotá
      {
        name: 'Bogotá',
        minLat: 4.47,
        maxLat: 4.835,
        minLng: -74.227,
        maxLng: -74.043,
      },
      // Medellín
      {
        name: 'Medellín',
        minLat: 6.12,
        maxLat: 6.38,
        minLng: -75.65,
        maxLng: -75.48,
      },
      // Cali
      {
        name: 'Cali',
        minLat: 3.35,
        maxLat: 3.54,
        minLng: -76.58,
        maxLng: -76.44,
      },
      // Barranquilla
      {
        name: 'Barranquilla',
        minLat: 10.9,
        maxLat: 11.05,
        minLng: -74.85,
        maxLng: -74.75,
      },
      // Cartagena
      {
        name: 'Cartagena',
        minLat: 10.35,
        maxLat: 10.48,
        minLng: -75.58,
        maxLng: -75.46,
      },
      // Bucaramanga
      {
        name: 'Bucaramanga',
        minLat: 7.08,
        maxLat: 7.18,
        minLng: -73.18,
        maxLng: -73.08,
      },
      // Pereira
      {
        name: 'Pereira',
        minLat: 4.78,
        maxLat: 4.84,
        minLng: -75.72,
        maxLng: -75.65,
      },
      // Manizales
      {
        name: 'Manizales',
        minLat: 5.04,
        maxLat: 5.09,
        minLng: -75.54,
        maxLng: -75.48,
      },
      // Santa Marta
      {
        name: 'Santa Marta',
        minLat: 11.2,
        maxLat: 11.28,
        minLng: -74.24,
        maxLng: -74.16,
      },
      // Ibagué
      {
        name: 'Ibagué',
        minLat: 4.42,
        maxLat: 4.48,
        minLng: -75.27,
        maxLng: -75.18,
      },
      // Villavicencio
      {
        name: 'Villavicencio',
        minLat: 4.12,
        maxLat: 4.2,
        minLng: -73.68,
        maxLng: -73.58,
      },
      // Pasto
      {
        name: 'Pasto',
        minLat: 1.19,
        maxLat: 1.24,
        minLng: -77.31,
        maxLng: -77.24,
      },
      // Neiva
      {
        name: 'Neiva',
        minLat: 2.9,
        maxLat: 2.96,
        minLng: -75.34,
        maxLng: -75.26,
      },
      // Popayán
      {
        name: 'Popayán',
        minLat: 2.43,
        maxLat: 2.48,
        minLng: -76.64,
        maxLng: -76.58,
      },
      // Armenia
      {
        name: 'Armenia',
        minLat: 4.52,
        maxLat: 4.58,
        minLng: -75.72,
        maxLng: -75.66,
      },
    ];

    // Seleccionar una ciudad aleatoria
    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const selectedCity = cities[randomCityIndex];

    // Generar coordenadas aleatorias dentro de los límites de la ciudad
    const randomLat =
      Math.random() * (selectedCity.maxLat - selectedCity.minLat) +
      selectedCity.minLat;
    const randomLng =
      Math.random() * (selectedCity.maxLng - selectedCity.minLng) +
      selectedCity.minLng;

    return {
      lat: parseFloat(randomLat.toFixed(6)),
      lng: parseFloat(randomLng.toFixed(6)),
      city: selectedCity.name,
    };
  }

  public async seedVentures(amount: number) {
    const allVentureCategories =
      await this.ventureCategoriesService.getVentureCategories({ search: '' });
    console.log('FOUND CATEGORIES', allVentureCategories.total);
    for await (const _ of Array(amount).keys()) {
      console.log('SEEDING VENTURE ', _ + 1, ' of ', amount);
      const { lat, lng } = this.getRandomColombianCoordinates();
      const venture: VentureCreate = {
        name: faker.company.name(),
        coverPhoto: faker.image.urlLoremFlickr({
          category: 'business',
          width: 800,
          height: 600,
        }),
        location: {
          // Random int between 1 and 1000 for municipalityId
          municipalityId: faker.number.int({ min: 733, max: 1232 }),
          lat,
          lng,
          description: faker.location.streetAddress({}),
        },
        contact: {
          email: faker.internet.email(),
          phoneNumber: faker.phone.number({ style: 'international' }),
        },
        description: faker.lorem.paragraphs(2),
        categoriesIds: [],
        // categoriesIds: allVentureCategories
        //   .slice(
        //     0,
        //     faker.number.int({ min: 1, max: allVentureCategories.length }),
        //   )
        //   .map(({ id }) => id),
      };

      const randomUser: User | null =
        await this.userHttpService.getRandomUser();
      if (!randomUser) continue;
      await this.venturesService.saveVenture(venture, randomUser?.email);
    }

    // for await (const _ of Array(amount).keys()) {
    //   const firstName = faker.person.firstName();
    //   const lastName = faker.person.lastName();
    //   const user: User = {
    //     id: faker.string.uuid(),
    //     picture: faker.image.avatar(),
    //     email: faker.internet.email({
    //       firstName: firstName,
    //       lastName: lastName,
    //     }),
    //     firstName,
    //     lastName,
    //     active: true,
    //     verified: faker.datatype.boolean(),
    //     onboardingCompleted: true,
    //     roles: [],
    //     preferences: [],
    //     gender: 'M',
    //     birthDate: undefined,
    //     comments: [],
    //     donations: [],
    //     notifications: [],
    //     publicationClaps: [],
    //     sponsorships: [],
    //     subscriptions: [],
    //     ventures: [],
    //     createdAt: undefined,
    //     updatedAt: undefined
    //   }

    //   user.firstName = faker.person.firstName();
    //   user.lastName = faker.person.lastName();
    //   user.email = faker.internet.email({
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //   });
    //   user.password = faker.internet.password();
    //   user.birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    //   user.phone = faker.phone.number('+52 55 ### ## ##');
    //   user.address = faker.location.streetAddress();
    // }
  }
}
