import { Inject, Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import {
  ContentType,
  PublicationComment,
  PublicationContent,
  PublicationCreate,
} from 'echadospalante-domain';

import { UserHttpService } from '../gateway/http/http.gateway';
import { PublicationCategoriesService } from './../../../publications/domain/service/publication-categories.service';
import { PublicationsService } from './../../../publications/domain/service/publications.service';
import { VenturesService } from '../../../ventures/domain/service/ventures.service';
import { PublicationCommentsService } from './publication-comments.service';
import { PublicationClapsService } from './publication-claps.service';

@Injectable()
export class SeedService {
  public constructor(
    private publicationCategoriesService: PublicationCategoriesService,
    private publicationService: PublicationsService,
    private publicationCommentsService: PublicationCommentsService,
    private publicationClapsService: PublicationClapsService,
    private venturesService: VenturesService,
    @Inject(UserHttpService)
    private userHttpService: UserHttpService,
  ) {}

  public async seedPublications(amount: number) {
    const { items: allPublicationCategories } =
      await this.publicationCategoriesService.getPublicationCategories();
    const batchSize = 1; // Change to 10 or 100 for larger batches
    for await (const _ of Array(amount).keys()) {
      const randomVenture = await this.venturesService.getRandomVenture();
      console.log(`Seeding publication: `, (_ + 1) * batchSize);
      if (!randomVenture) continue;
      const arr = Array.from({ length: batchSize });
      await Promise.all(
        arr.map(() => {
          const publicationCreate: PublicationCreate = {
            description: faker.lorem.paragraphs(1),
            contents: this.getRandomContents(),
            categoriesIds: allPublicationCategories
              .slice(
                0,
                faker.number.int({
                  min: 1,
                  max: allPublicationCategories.length,
                }),
              )
              .map(({ id }) => id),
          };

          return this.publicationService.savePublication(
            publicationCreate,
            randomVenture.id,
            randomVenture.owner!.email,
          );
        }),
      );
    }
  }

  private getRandomContents(): PublicationContent[] {
    return Array(faker.number.int({ min: 1, max: 10 }))
      .fill(null)
      .map(() => ({
        type: faker.helpers.arrayElement([
          ContentType.TEXT,
          ContentType.IMAGE,
          ContentType.VIDEO,
          ContentType.LINK,
          ContentType.FILE,
        ]),
      }))
      .map((content) => {
        const { type } = content;
        switch (type) {
          case ContentType.TEXT:
            return {
              id: faker.string.uuid(),
              type,
              content: faker.lorem.paragraphs(1),
            };
          case ContentType.IMAGE:
            return {
              id: faker.string.uuid(),
              type,
              content: faker.image.url(),
            };
          case ContentType.VIDEO:
            return {
              id: faker.string.uuid(),
              type,
              content: faker.internet.url(),
            };
          case ContentType.LINK:
            return {
              id: faker.string.uuid(),
              type,
              content: faker.internet.url(),
            };
          case ContentType.FILE:
            return {
              id: faker.string.uuid(),
              type,
              content: faker.internet.url(),
            };
          default:
            throw new Error(`Unknown content type: ${type}`);
        }
      });
  }

  public async seedComments(amount: number) {
    const batchSize = 20; // Change to 10 or 100 for larger batches
    for await (const _ of Array(amount).keys()) {
      const [randomPublication, randomUser] = await Promise.all([
        this.publicationService.getRandomPublication(),
        this.userHttpService.getRandomUser(),
      ]);

      console.log(`Seeding comments: `, (_ + 1) * batchSize);
      if (!randomPublication || !randomUser) continue;
      const arr = Array.from({
        length: faker.number.int({ min: 1, max: batchSize }),
      });
      await Promise.all(
        arr.map(() => {
          return this.publicationCommentsService.saveComment(
            randomPublication.id,
            randomUser.id,
            faker.lorem.paragraphs(1),
          );
        }),
      );
    }
  }

  public async seedClaps(amount: number) {
    const batchSize = 30; // Each user will clap for a random number of publications between 1 and batchSize
    for await (const _ of Array(amount).keys()) {
      const randomPublications = await Promise.all(
        Array.from({
          length: faker.number.int({ min: 1, max: batchSize }),
        }).map(() => this.publicationService.getRandomPublication()),
      ).then((publications) =>
        publications.filter((publication) => publication !== null),
      );

      const randomUser = await this.userHttpService.getRandomUser();

      console.log(`Seeding comments: `, (_ + 1) * batchSize);
      if (randomPublications.length === 0 || !randomUser) continue;

      try {
        await Promise.all(
          randomPublications.map((pub) => {
            return this.publicationClapsService.saveClap(pub.id, randomUser.id);
          }),
        );
      } catch (error) {
        console.error(`Error seeding claps`, error);
      }
    }
  }
}
