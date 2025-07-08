import { IWorldOptions, World } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';

export class CustomCtx extends World {
 
  app: INestApplication;
  response: any;
  token: string;
  currentPage: string;
  ventureCreatePayload: Record<string, any>;
  publicationCreatePayload: Record<string, any>;
  eventCreatePayload: Record<string, any>;
  testVentureId: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}
