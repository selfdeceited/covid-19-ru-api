import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataRetrieverService } from './data-retriever/data-retriever.service';
import { of } from 'rxjs';

describe('AppController', () => {
  let appController: AppController;
  const dataRetrieverService = {
    fetchForDate: function() {
      return of({data: ``})
    }
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, DataRetrieverService],
    })
    .overrideProvider(DataRetrieverService)
    .useValue(dataRetrieverService)
    .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
