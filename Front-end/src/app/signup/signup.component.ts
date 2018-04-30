import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Countries } from '../_models';
import { MatDialogRef } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['../../../node_modules/bootstrap/dist/css/bootstrap.min.css',   './signup.component.css']
})
export class SignupComponent implements OnInit {
    signUpForm = new FormGroup({
        name: new FormControl('', Validators.required),
        dob: new FormControl({value: null, disabled: true}, Validators.required),
        email: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),
        confirmmail: new FormControl('', Validators.required),
        password: new FormControl('', [
            Validators.required
        ]),
        confirmpass: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
    });

    hide = true;
    countries = new Countries;
    startDate = new Date(1997, 0, 1);
    userSignup = 'User';

    responseCode = {};
    signupSuccess = false;

    signupSuccessMessage = 'You have been signed up successfully';
    signupAction = '';
    snackConfig: MatSnackBarConfig = {
        verticalPosition: 'top',
        duration: 3000
    };

    data = {};

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private dialogRef: MatDialogRef<SignupComponent>,
        private snackBar: MatSnackBar
    ) { }

    onSubmit() {
        console.log('I am here');
        console.log(this.signUpForm.value);
        this.data['EmailId'] = this.signUpForm.value['email'];
        this.data['Password'] = this.signUpForm.value['password'];
        this.data['Name'] = this.signUpForm.value['name'];
        this.data['DOB'] = this.signUpForm.value['dob'];
        this.data['Country'] = this.signUpForm.value['country'];

        if (this.userSignup === 'User') {
            this.data['isManufacturer'] = 0;
            this.data['isUser'] = 1;
            console.log(this.signUpForm.value);
        } else if (this.userSignup === 'Manufacturer') {
            console.log(this.signUpForm.value['password']);
            this.data['isManufacturer'] = 1;
            this.data['isUser'] = 0;
            console.log(this.signUpForm.value);
        }

        this.userService.createUser(this.data).subscribe(res => {
            this.responseCode = res;
            console.log(res);
            if (this.responseCode['status'] === 'success') {
                this.dialogRef.close();
                this.snackBar.open(this.signupSuccessMessage, this.signupAction, this.snackConfig);
                this.signupSuccess = true;
            } else if (this.responseCode.hasOwnProperty('errorType')) {
                console.log('In Error Type');
                this.signUpForm.controls['password'] = null;
            }
        });
    }

    ngOnInit() {
    }
}
