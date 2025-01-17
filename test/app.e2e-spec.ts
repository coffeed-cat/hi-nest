import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect("I'm App");
  });

  describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('POST', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'test', year: 1999, genres: ['test'] })
        .expect(201);
    });

    it('DELETE', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    it('GET200', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });
    it('GET404', () => {
      return request(app.getHttpServer()).get('/movies/999').expect(404);
    });

    it('PATCH200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'forPatch', year: 2022, genres: ['action'] })
        .expect(200);
    });

    it('PATCH400', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ id: 999 })
        .expect(400);
    });

    it('DELETE200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });

    it('DELETE404', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(404);
    });
  });
});
