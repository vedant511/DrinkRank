import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Util } from './util';
import { User } from '../_models';

@Injectable()
export class AuthService {

    private newUtil = new Util();
    private currentUser: User;
    private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) { }

    login(email: string, password: string) {

        /* Salting */
        /*const bcrypt = require('bcrypt');
        const bcryptCost = 10;
        bcrypt.hash(password, s_salt, function (errHash, hashed) {
            bcrypt.genSalt(bcryptCost, function (errGenSalt, c_salt) {
                bcrypt.hash(hashed, c_salt, function (errDoubleHash, d_hashed) {

                   // POST

                });
            });
        });*/

        return this.http.post<any>(this.newUtil.serverUrl + '/login', { 'EmailId': email, 'Password': password })
            .map(user => {
                //console.log('[Debug] received data after login:\n', user);

                // login successful if there's a jwt token in the response
                if (user && user.AuthToken) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('authToken', JSON.stringify(user.AuthToken));
                    this.loggedIn.next(true);
                } else {
                    return Observable.throw('ErrorLogin');
                }

                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('productList');
        this.loggedIn.next(false);
    }

    get isLoggedIn() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (this.currentUser) {
            this.loggedIn.next(true);
        } else {
            this.loggedIn.next(false);
        }

        return this.loggedIn.asObservable();
    }

    getJwtToken() {
        return JSON.parse(localStorage.getItem('authToken'));
    }

    getUserGroup() {
        /*********************************************/
        /*                                           */
        /* jwt decoding should be here in the future */
        /*                                           */
        /*********************************************/

        return this.getJwtToken(); // modify this after jwt is ready
    }

    isUser() {
        if (this.getUserGroup() === 'isUser') {
            return true;
        }
        return false;
    }

    isMfr() {
        if (this.getUserGroup() === 'isManufacturer') {
            return true;
        }
        return false;
    }

    isAdmin() {
        if (this.getUserGroup() === 'isAdmin') {
            return true;
        }
        return false;
    }
}
