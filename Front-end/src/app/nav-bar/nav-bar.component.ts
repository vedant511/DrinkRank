import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../_services';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css', '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class NavBarComponent implements OnInit {

  private isLoggedIn$: Observable<boolean>;
  signUpDialogRef: MatDialogRef<SignupComponent>;
  loginDialogRef: MatDialogRef<LoginComponent>;

  constructor(
      private authService: AuthService,
      private dialog: MatDialog
  ) {  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    //console.log('navbar ', this.isLoggedIn$);
  }

  openLoginDialog() {
      this.loginDialogRef = this.dialog.open(LoginComponent);
      this.loginDialogRef = this.loginDialogRef.updateSize('50%' ) ;
  }

  openSignupDialog() {
      this.signUpDialogRef = this.dialog.open(SignupComponent);
      this.signUpDialogRef = this.signUpDialogRef.updateSize('50%' ) ;
  }
}
