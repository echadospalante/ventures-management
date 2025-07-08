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
  'I am a registered user, I want to create a new event',
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
    this.testVentureId = '96ab7403-39d7-4979-a8cd-8dac7b36ea66';
  },
);

When('I fill in the event create fields', function (this: CustomCtx) {
  this.eventCreatePayload = {
    title: 'Test event',
    description: 'Test',
    coverPhoto:
      'https://storage.googleapis.com/echadospalante-publications-bucket/7ad7063a-64c8-4a6e-a434-8bbc200da257.jpeg',
    locationLat: '6.0282',
    locationLng: '-75.4359',
    locationDescription: 'Test description',
    datesAndHours: [
      { date: '2025-07-09', workingRanges: [{ start: '09:00', end: '17:00' }] },
    ],
    categoriesIds: [
      '6353476e-1f3c-4f22-9b76-531160d3106a',
      '994f60c0-95b8-4875-8130-c5d7911350b7',
    ],
    contactEmail: 'juancamilo19997814@gmail.com',
    contactPhoneNumber: '3122555467',
    municipalityId: 840,
  };
});

When('I click the Create Event button', async function (this: CustomCtx) {
  const response = await request(this.app.getHttpServer())
    .post(`/api/v1/ventures/${this.testVentureId}/events`)
    .set('X-Requested-By', 'juancamilo1999@gmail.com')
    .set('Content-Type', 'application/json')
    .send(this.eventCreatePayload);
  this.response = response;
});

Then(
  'Since I am not the owner of the venture, so I cannot create an event, I should receive a {int} status code',
  function (this: CustomCtx, expectedStatusCode: number) {
    assert.strictEqual(this.response.status, expectedStatusCode);
  },
);
