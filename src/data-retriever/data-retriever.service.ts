import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import parse = require('csv-parse/lib/sync');

@Injectable()
export class DataRetrieverService {
    constructor(private httpService: HttpService) {}

    fetchForDate(date: Date): Observable<any> {
        return this.callServer(date)
            .pipe(
                map(d => d.data),
                map(d => parse(d)),
                map(d => this.transform(d)),
                map(d => this.filterOut(d, ['Province_State', 'Country_Region', 'Confirmed', 'Deaths', 'Recovered', 'Active'])),
                map(d => this.filterOutByRegion(d)),
                map(d => JSON.stringify(d)),
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

    private filterOutByRegion(arr: Array<any>) {
        return arr.filter(x => x["Country_Region"] === "Russia");
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
