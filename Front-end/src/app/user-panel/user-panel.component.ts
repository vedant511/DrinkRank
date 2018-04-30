import { Component, OnInit, NgModule, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { User } from '../_models';
import { AuthService, UserService } from '../_services';
import { DialogEditUserInfoComponent } from './dialog-edit-user-info';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})

export class UserPanelComponent implements OnInit {

  currentUser: User;
  authToken: string;
  userGroup: string;

  constructor(
    private authService: AuthService,
    private userServicce: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userGroup = this.authService.getUserGroup();
    this.refresh();
  }

  refresh() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.changeDetectorRef.detectChanges();
  }


  onEditInfo() {
    const dialogEditUserInfoRef = this.dialog.open(DialogEditUserInfoComponent);
    dialogEditUserInfoRef.disableClose = true;

    dialogEditUserInfoRef.componentInstance.oldName = this.currentUser['Name'];
    dialogEditUserInfoRef.componentInstance.oldCountry = this.currentUser['Country'];
    dialogEditUserInfoRef.componentInstance.oldPhone = this.currentUser['Phone'];

    dialogEditUserInfoRef.afterClosed().subscribe(dataAfterEdit => {
      if (!(dataAfterEdit === null)) {
        // the DOB should not be edited the user because it's a age validation property
        // but the API does no support yet so send the unchanged DOB
        // city is the same
        const dob_backup = this.currentUser['DOB'];
        dataAfterEdit['DOB'] = this.currentUser['DOB'].replace(/\//g, '');
        dataAfterEdit['City'] = this.currentUser['City'];
        this.userServicce.editProfile(dataAfterEdit).subscribe(
          res => {
            /* Update local storage */
            dataAfterEdit['DOB'] = dob_backup;
            localStorage.setItem('currentUser', JSON.stringify(dataAfterEdit));
            this.refresh();
          }
        );
      }
    });

  }

}
