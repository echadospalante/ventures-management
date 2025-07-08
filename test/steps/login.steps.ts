import { Given, Then, When, setWorldConstructor } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import assert from 'assert';
import { AppModule } from 'src/app/app.module';
import request from 'supertest';
import { CustomCtx } from 'test/ctx/custom-context';

setWorldConstructor(CustomCtx);

let app: INestApplication;

Given('I am a registered user', async function (this: CustomCtx) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api/v1');
  await app.init();
  this.app = app;
});

When('I login with my Google account', async function (this: CustomCtx) {
  this.token =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjhlOGZjOGU1NTZmN2E3NmQwOGQzNTgyOWQ2ZjkwYWUyZTEyY2ZkMGQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNjcyNTAyNzk5NjQtNDN0bHViNmo2Y2x0ZGxmOWV1Y3Y4cG10MzNlYTcxZWMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNjcyNTAyNzk5NjQtNDN0bHViNmo2Y2x0ZGxmOWV1Y3Y4cG10MzNlYTcxZWMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE5NjE4MzA1OTg0NjA4MjM3NjkiLCJlbWFpbCI6Imp1YW5jYW1pbG8xOTk5NzgxNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzUxOTYyNDA1LCJuYW1lIjoiSnVhbiBDYW1pbG8gQ2FyZG9uYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMR0ZtNUYzemYzTW1qNXRSUTItelpjSXRNR2RNcnZPMFM3dXBrdy1Gdm4ybEx6OWhJX1l3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikp1YW4gQ2FtaWxvIiwiZmFtaWx5X25hbWUiOiJDYXJkb25hIiwiaWF0IjoxNzUxOTYyNzA1LCJleHAiOjE3NTE5NjYzMDUsImp0aSI6ImU5NWM2YmM2YzkxNTBmNzRjM2Q4YWExMDA4YzRiYmNjZjQyMjRhZjYifQ.eAZivv1K4k1C2Dr6Dsyhh98yxxvOoCmigkwh7Dnale65FO8229mtXDkCwFxLuu1n8el_Awv6UkNJy3kNGNrR4dBoxR-iRV7w8KEcp579dQglNXLoNJ2gnLrtewks6kARf6JPHIfIaKnaHowBqZPdKZtTlzNPnUhVgZ2VU2rv1TXUTEWBmZLvc51Bu5VP-I9PWI08RZ-7ZQXn1PTYvN7o5rgGonpVFZLRYjYPJx_F9U6Qzy8XqFYzBI-IziGuuYzRtHqhstZbiGGeYyFBrhxx4V6zZWt9jILITT24j2JsM5ey-aOGKA9g0VtRe14HjF_LWvEzDR__3vw6XL_QDLqRlA';
  const response = await request('http://localhost:5000')
    .post('/api/v1/auth/login')
    .set('Authorization', `Bearer ${this.token}`);
  this.response = response;
});

Then(
  'I should get a {int} status code, and redirected to the dashboard',
  function (this: CustomCtx, expectedStatusCode: number) {
    assert.strictEqual(this.response.status, expectedStatusCode);
  },
);
