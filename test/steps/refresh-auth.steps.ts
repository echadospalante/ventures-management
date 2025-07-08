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
  'I am a registered user and I have an active session',
  async function (this: CustomCtx) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    this.app = app;
  },
);

When('I refresh my authentication token', async function (this: CustomCtx) {
  this.token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5jYW1pbG8xOTk5NzgxNEBnbWFpbC5jb20iLCJpYXQiOjE3NTE5NjI3MDcsImV4cCI6MTc1MjA0OTEwN30.54f2yHdnvklUbu2ntogh3bcyL_3WIrwB6g6FL0J0g7s';
  const response = await request('http://localhost:5000')
    .get('/api/v1/auth/refresh')
    .set('Cookie', `authentication=${this.token}`);
  this.response = response;
});

Then(
  'I should get a {int} status code, and a new authentication token',
  function (this: CustomCtx, expectedStatusCode: number) {
    assert.strictEqual(this.response.status, expectedStatusCode);
  },
);
