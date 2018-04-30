import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthService } from '../_services/index';
import { User, Manufacturer } from '../_models/index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    loginFail: boolean;

    snackConfig: MatSnackBarConfig = {
        verticalPosition: 'top',
        duration: 3000
    };
    loginSuccessMessage = 'You have Logged in Successfully!';
    loginAction = '';

    logInForm = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [
            Validators.required
        ]),
        password: new FormControl('', [
            Validators.required,
        ]),
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService,
        private dialogRef: MatDialogRef<LoginComponent>,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        // reset login status
        this.authService.logout();
        this.loginFail = false;

        // get return url from route parameters or default to 'user-panel'
        console.log(this.router.url);

        if (this.router.url === '/logout') {
            this.returnUrl = 'user-panel';
        } else {
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.router.url || 'user-panel';
        }
    }

    login() {
        // console.log('[Debug] Login clicked');

        this.loading = true;
        this.authService.login(this.model.email, this.model.password)
            .subscribe(
                data => {
                    // console.log('[Debug] Login success');
                    this.dialogRef.close();
                    this.snackBar.open(this.loginSuccessMessage, this.loginAction, this.snackConfig);
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    // console.log('[Debug] Login fails');
                    this.loginFail = true;
                    this.loading = false;
                });
    }
}
