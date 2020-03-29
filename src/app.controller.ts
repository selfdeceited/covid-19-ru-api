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
    // todo: if not found today, fallback to latest
    // 'http://localhost:3000/date/2020-03-27'
    return this.dataRetrieverService.fetchForDate(new Date(Date.parse(date)));
  }
}
