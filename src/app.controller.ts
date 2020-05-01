import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { DataRetrieverService } from './data-retriever/data-retriever.service'
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataRetrieverService: DataRetrieverService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("date/:date")
  getForToday(@Param('date') date): Observable<any> {
    // todo: throw if not found, no message as now
    return this.dataRetrieverService.fetch(new Date(Date.parse(date)));
  }

  @Get("moscow/:days?")
  moscow(@Param('days') days): Observable<any> {
    return this.dataRetrieverService.fetchMoscowData(+days || 14);
  }
}
