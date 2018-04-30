import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, AuthService } from '../../_services';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent implements OnInit {

  data = {};
  loading: boolean;
  incorrectCurrPwd = false;
  hide = true;

  changePwdForm = new FormGroup({
    currPwd: new FormControl('', Validators.required),
    newPwd: new FormControl('', Validators.required),
    confirmPwd: new FormControl('', Validators.required),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private userSerivce: UserService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    this.data['old'] = this.changePwdForm.value['currPwd'];
    this.data['new'] = this.changePwdForm.value['newPwd'];
    this.userSerivce.changePassword(this.data)
      .subscribe(
        res => {
          this.loading = false;
          console.log(res);
          if (res === 'Old Password doesn\'t match') {
            this.openDialogIncorrectPwd();
          } else {
            this.openDialogChangeSucess();
          }
        },
        err => { alert('Error in changePwd'); }
      );
  }

  openDialogIncorrectPwd() {
    const dialogRef = this.dialog.open(DialogIncorrectCurrPwd);
  }

  openDialogChangeSucess() {
    const dialogRef = this.dialog.open(DialogChangePwdSucess);
    dialogRef.afterClosed().subscribe(
      res => {
        this.authService.logout();
        this.router.navigateByUrl('/home');
      });
  }
}

@Component({
  selector: 'dialog-incorrect-current-pwd',
  templateUrl: 'dialog-incorrect-current-pwd.html',
})
export class DialogIncorrectCurrPwd {

  constructor(
    public dialogRef: MatDialogRef<DialogIncorrectCurrPwd>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-change-pwd-sucess',
  templateUrl: 'dialog-change-pwd-sucess.html',
  styles: [ 'p {width: 300px;}' ]
})
export class DialogChangePwdSucess {

  constructor(
    public dialogRef: MatDialogRef<DialogChangePwdSucess>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
