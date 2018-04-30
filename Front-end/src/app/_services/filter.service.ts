import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Util } from './util';

@Injectable()
export class FilterService {

  newUtil = new Util();

  topWineURL = this.newUtil.serverUrl + '/topWines';
  wineDetailURL = this.newUtil.serverUrl + '/wineData';
  topManufacturerURL = this.newUtil.serverUrl + '/topmanufacturers';
  manuDetailURL = this.newUtil.serverUrl + '/manufacturerdata';
  searchWineURL = '';
  filterWineURL = this.newUtil.serverUrl + '/filteredresults';

  wineByMfrNameUrl = this.newUtil.serverUrl + '/getwines/bymanufacturer?manufacName=';

  constructor(private http: HttpClient) {
   }

  getTopWines(winePage): Observable<any> {
    console.log(winePage);
    return this.http.get(this.topWineURL, {
      params: winePage
    });
  }

  getTopManufacturers(manufacturerPage): Observable<any> {
      return this.http.get(this.topManufacturerURL, {
        params: manufacturerPage
      });
  }

  getWine(wineId): Observable<any> {
    return this.http.get(this.wineDetailURL, {
      params: wineId
    });
  }

  getManufacturerWines(manuEmail): Observable<any> {
    return this.http.get(this.manuDetailURL, {
      params: manuEmail
    });
  }

  searchWines(searchFilter): Observable<any> {
    return this.http.get(this.filterWineURL,{
      params: searchFilter
    });
  }

  // fetch wines by a name of manufacturer
  getWineByMfrName(mfrName): Observable<any> {
    return this.http.get(this.getWineByMfrName + encodeURI(mfrName));
  }
}
