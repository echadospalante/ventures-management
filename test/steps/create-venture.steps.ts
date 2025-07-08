import { Given, Then, When, setWorldConstructor } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import assert from 'assert';
import { AppModule } from 'src/app/app.module';
import request from 'supertest';
import { CustomCtx } from 'test/ctx/custom-context';

setWorldConstructor(CustomCtx);

let app: INestApplication;

Given(
  'I am user active and allowed to create ventures',
  async function (this: CustomCtx) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    this.app = app;

    this.token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5jYW1pbG8xOTk5NzgxNEBnbWFpbC5jb20iLCJpYXQiOjE3NTE5NDY5NjAsImV4cCI6MTc1MjAzMzM2MH0.8dVQ8E-Fa9sB3vfy6g5yyeTpF_WBn3fbd7MkciwGgQk';
  },
);

Given(
  'I am on the {string} page',
  function (this: CustomCtx, pageName: string) {
    this.currentPage = pageName;
  },
);

When('I fill in the venture create fields', function (this: CustomCtx) {
  this.ventureCreatePayload = {
    name: 'Test name',
    description: 'Test description',
    coverPhoto: 'https://example.com/photo.jpg',
    categoriesIds: [
      'fac9633c-4f9f-4f1c-9f5a-1c8eb75c145b',
      'f182e9da-cd2a-483c-b43d-3c830d888ad8',
    ],
    municipalityId: 840,
    contactEmail: 'someemail@gmail.com',
    contactPhoneNumber: '3122555342',
    locationLat: 6.2518,
    locationLng: -75.5636,
    locationDescription: 'Test location description',
  };
});

When(
  'I click the {string} button',
  async function (this: CustomCtx, buttonName: string) {
    const response = await request(this.app.getHttpServer())
      .post('/api/v1/ventures')
      .set('X-Requested-By', 'juancamilo19997814@gmail.com')
      .set('Content-Type', 'application/json')
      .send(this.ventureCreatePayload);
    this.response = response;
  },
);

Then(
  'I should receive a {int} status code',
  function (this: CustomCtx, expectedStatusCode: number) {
    assert.strictEqual(this.response.status, expectedStatusCode);
  },
);
