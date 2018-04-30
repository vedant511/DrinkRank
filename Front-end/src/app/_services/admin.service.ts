import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Util } from './util';

@Injectable()
export class AdminService {

  newUtil = new Util();
  pendingPostsURL = this.newUtil.serverUrl + '/fetch-pending-requests';
  updatePostURL = this.newUtil.serverUrl + '/update-status-new';
  everyPostURL = this.newUtil.serverUrl + '/fetch-completed-requests';

  constructor(
      private http: HttpClient
  ) { }

  fetchPending(filter): Observable<any> {
      // return this.http.get(this.pendingPostsURL);
      return this.http.get(this.pendingPostsURL, {
        params: filter
      });
  }

  updateNewPosts(identifier): Observable<any> {
    return this.http.post(this.updatePostURL, identifier);
  }

  fetchOther(filter): Observable<any> {
    return this.http.get(this.everyPostURL, {
      params: filter
    });
  }
}
