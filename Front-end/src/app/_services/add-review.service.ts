import { Injectable } from '@angular/core';
import { Util } from './util';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AddReviewService {

  newUtil = new Util();
  addReviewURL = this.newUtil.serverUrl + '/savereview';

  constructor(
      private http: HttpClient
  ) { }

  submitReview(review): Observable<any> {
    return this.http.post(this.addReviewURL, review);
  }
}
