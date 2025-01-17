import { NotFoundException, Patch } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne()', () => {
    it('should be defined', () => {
      service.create({
        title: 'Test',
        year: 2020,
        genres: ['test'],
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('should throw error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteOne()', () => {
    it('should kill one member of movie', () => {
      service.create({
        title: 'Test',
        year: 2020,
        genres: ['test'],
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      service.deleteOne(1);
      try {
        service.getOne(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw 404 error', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create()', () => {
    it('should create one movies member', () => {
      const before = service.getAll().length;
      service.create({
        title: 'Test',
        year: 2020,
        genres: ['test'],
      });
      const after = service.getAll().length;

      expect(after).toBeGreaterThan(before);
    });
  });

  describe('update()', () => {
    it('should update movie', () => {
      service.create({
        title: 'Test',
        year: 2020,
        genres: ['test'],
      });
      service.update(1, {
        year: 2021,
      });
      const movie = service.getOne(1);
      expect(movie.year).toEqual(2021);
    });
  });
});
