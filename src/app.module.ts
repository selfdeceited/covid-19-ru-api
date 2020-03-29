import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataRetrieverService } from './data-retriever/data-retriever.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, DataRetrieverService],
})
export class AppModule {}
