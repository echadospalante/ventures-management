import { Inject, Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { User, VentureCreate } from 'echadospalante-domain';

import { UserHttpService } from '../gateway/http/http.gateway';
import { VenturesService } from '../service/ventures.service';
import { VentureCategoriesService } from './venture-categories.service';

@Injectable()
export class SeedService {
  public constructor(
    private ventureCategoriesService: VentureCategoriesService,
    private venturesService: VenturesService,
    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
  ) {}

  public async seedVentures(amount: number) {
    const allVentureCategories =
      await this.ventureCategoriesService.getVentureCategories({ search: '' });
    console.log('FOUND CATEGORIES', allVentureCategories.total);
    for await (const _ of Array(amount).keys()) {
      console.log('SEEDING VENTURE ', _ + 1, ' of ', amount);
      const venture: VentureCreate = {
        name: faker.company.name(),
        coverPhoto: faker.image.urlLoremFlickr({
          category: 'business',
          width: 800,
          height: 600,
        }),
        location: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
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
