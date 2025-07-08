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
  'I am a registered user, I want to create a new publication',
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

When('I fill in the publication create fields', function (this: CustomCtx) {
  this.publicationCreatePayload = {
    description: 'Descripción de prueba',
    type: 'STANDARD',
    body: [
      {
        id: 'b4a10af5-281a-47a0-8e31-fbe8a1495c76',
        type: 'TEXT',
        content: 'Texto 1 de prueba',
      },
      {
        id: '99902ec9-84a0-4283-9fbd-f7148b9f7555',
        type: 'TEXT',
        content: 'Texto 1 de prueba',
      },
      {
        id: '1451b593-00f4-4a43-be9a-b7e262ce04f6',
        type: 'IMAGE',
        content:
          'https://storage.googleapis.com/echadospalante-publications-bucket/7ad7063a-64c8-4a6e-a434-8bbc200da257.jpeg',
      },
    ],
    categoriesIds: [
      '607c1767-f07d-486e-a717-101e95cf27a0',
      '243c2655-5dba-4f17-8323-630b9c24a75b',
    ],
  };
});

When('I click the Create Publication button', async function (this: CustomCtx) {
  const response = await request(this.app.getHttpServer())
    .post(`/api/v1/ventures/${this.testVentureId}/publications`)
    .set('X-Requested-By', 'juancamilo1999@gmail.com')
    .set('Content-Type', 'application/json')
    .send(this.publicationCreatePayload);
  this.response = response;
});

Then(
  'Since I am not the owner of the venture, so I cannot create a publication, I should receive a {int} status code',
  function (this: CustomCtx, expectedStatusCode: number) {
    assert.strictEqual(this.response.status, expectedStatusCode);
  },
);
