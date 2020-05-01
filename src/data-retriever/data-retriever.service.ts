import { Injectable, HttpService } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import parse = require('csv-parse/lib/sync');

@Injectable()
export class DataRetrieverService {
    constructor(private httpService: HttpService) {}

    fetchMoscowData(dataForDays: number): any {       
      console.log(dataForDays);
      const observables = [...Array(dataForDays).keys()]
      .map(_ => {
        const before = new Date().getTime() - (1000 * 60 * 60 * 24 * _);
        return new Date(before);
      })
      .map(_ => {
        console.log(_);
        return this.fetchForDate(_)
            .pipe(
                map(d => this.moscow(d)[0]),
                catchError(err => this.catchError(err, _))
            )
        }
        );

      return forkJoin(observables);
    }   

    fetch(date: Date): Observable<any> {
        return this.fetchForDate(date)
            .pipe(
                map(d => this.russia(d)),
                map(d => JSON.stringify(d)),
                catchError(err => this.catchError(err, date))
            );
        
    }

    private catchError(err, date) {
        console.error("error has happened!");
        console.error(err);
        return of("not found for date: " + date.toLocaleDateString("en-US") );
    }

    private fetchForDate(date: Date): Observable<any> {
        return this.callServer(date)
            .pipe(
                map(d => d.data),
                map(d => parse(d)),
                map(d => this.transform(d)),
                map(d => this.filterOut(d, ['Province_State', 'Country_Region', 'Confirmed', 'Deaths', 'Recovered', 'Active'])),
                
            );
    }

    private transform(arr: Array<any>) {
        const headers  = arr.shift();
        return arr.map(place => {
            const a = {};
            place.map((prop, i) => {
            	a[headers[i]] = prop;
            })
            return a;
        }, {});
    }

    private russia(arr: Array<any>) {
        return arr.filter(x => x["Country_Region"] === "Russia");
    }

    private moscow(arr: Array<any>) {
        return arr.filter(x => x["Province_State"] === "Moscow");
    }

    private filterOut(arr: Array<any>, neededFields: Array<string>){
        return arr.map(function(item) { 
            const a = {};
            neededFields.map(_ => {
            	a[_] = item[_]
            })
            return a;
        });
    }

    private callServer(date: Date): Observable<any> {
        const dateFormatted = this.formatDate(date);
        const repo = "grwlf/COVID-19_plus_Russia";
        const folderStructure = "csse_covid_19_data/csse_covid_19_daily_reports";
        const url = `https://raw.githubusercontent.com/${repo}/master/${folderStructure}/${dateFormatted}.csv`;

        console.log(url);
        return this.httpService.get(url)
    }

    private formatDate(date: Date): string{
        const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(date);
        return `${mo}-${da}-${ye}`; // "03-27-2020";
    }
}
