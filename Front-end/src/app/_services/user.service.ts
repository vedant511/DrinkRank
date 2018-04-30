import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/operator/map';
import { User } from '../_models/index';
import { Util } from './util';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

    private jwtToken: string;
    private currentUser: User;
    private newUtil = new Util();

    constructor(private http: HttpClient, private authService: AuthService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    createUser(data): Observable<any> {
        return this.http.post(this.newUtil.serverUrl, data);
    }

    changePassword(data) {
        data['EmailId'] = this.currentUser.EmailId;
        return this.http.post(this.newUtil.serverUrl + '/update-password', data);
    }

    editProfile(data) {
        data['EmailId'] = this.currentUser.EmailId;
        console.log('editProfile POST data:', data);
        return this.http.patch(this.newUtil.serverUrl + '/updateprofile', data);
    }
}
