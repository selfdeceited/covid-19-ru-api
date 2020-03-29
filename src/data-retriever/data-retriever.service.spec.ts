import { Test, TestingModule } from '@nestjs/testing';
import { DataRetrieverService } from './data-retriever.service';
import { HttpService, HttpModule } from '@nestjs/common';

describe('DataRetrieverService', () => {
  let service: DataRetrieverService;
  const httpService = {}
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [DataRetrieverService],
    })
    .overrideProvider(HttpService)
    .useValue(httpService)
    .compile();

    service = module.get<DataRetrieverService>(DataRetrieverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
