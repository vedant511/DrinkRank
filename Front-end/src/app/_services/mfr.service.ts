import { Injectable } from '@angular/core';
import { Util } from './util';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MfrService {

  private newUtil = new Util();
  private getProdApi = this.newUtil.serverUrl + '/manufacturerwineslist';
  private editProdApi = this.newUtil.serverUrl + '/wineupdate';
  private delProdApi = this.newUtil.serverUrl + '/winedeletion';
  private addProdApi = this.newUtil.serverUrl + '/wineinsertion';

  constructor(private http: HttpClient) {
  }

    // fetch products information for a manufacturer
    getProdcutList(mfrName, mfrEmail): Observable<any> {
      return this.http.post(this.getProdApi,
        {'ManufacturerName': mfrName, 'ManufacturerEmail': mfrEmail});
    }

    // add a row of product
    addProdcut(data): Observable<any> {
      return this.http.post(this.addProdApi, data);
    }

    // update a row of product
    editProdcut(data): Observable<any> {
      return this.http.patch(this.editProdApi, data);
    }

    // delete a row of product
    delProdcut(targetId): Observable<any> {
      return this.http.post(this.delProdApi, { ID: targetId });
    }

}
