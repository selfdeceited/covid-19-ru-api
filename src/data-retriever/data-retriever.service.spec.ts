import { Test, TestingModule } from '@nestjs/testing';
import { DataRetrieverService } from './data-retriever.service';

describe('DataRetrieverService', () => {
  let service: DataRetrieverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataRetrieverService],
    }).compile();

    service = module.get<DataRetrieverService>(DataRetrieverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
