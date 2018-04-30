import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailValidator } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertService, UserService, AuthService, FilterService, MfrService, AdminService, AddReviewService } from './_services/index';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './_guards/index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LogoutComponent } from './logout/logout.component';
import { ConsoleMemberComponent } from './console-member/console-member.component';
import { ConsoleMfrComponent } from './console-mfr/console-mfr.component';
import { ConsoleAdminComponent } from './console-admin/console-admin.component';
import { WineDetailComponent } from './wine-detail/wine-detail.component';
import { ManufacturerDetailComponent } from './manufacturer-detail/manufacturer-detail.component';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { ProductsListComponent } from './products-list/products-list.component';
import { DialogConfirmComponent } from './_directives/dialog-confirm.component';
import { DialogEditProdComponent } from './products-list/dialog-edit-prod.component';
import { DialogAddProdComponent } from './products-list/dialog-add-prod.component';
import { DialogEditUserInfoComponent } from './user-panel/dialog-edit-user-info';
import { DialogIncorrectCurrPwd } from './user-panel/change-password/change-password.component';
import { DialogChangePwdSucess } from './user-panel/change-password/change-password.component';
import { ImageUploadModule } from 'angular2-image-upload';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ChangePasswordComponent } from './user-panel/change-password/change-password.component';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { ReviewPanelComponent } from './review-panel/review-panel.component';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot(),
    RecaptchaModule.forRoot({ siteKey: '6LfAjVMUAAAAALuOUGQS9buXzQT-gOW42pVl9If2', }),
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    UserPanelComponent,
    NotFoundComponent,
    LogoutComponent,
    ConsoleMemberComponent,
    ConsoleMfrComponent,
    ConsoleAdminComponent,
    WineDetailComponent,
    ManufacturerDetailComponent,
    ProductsListComponent,
    DialogConfirmComponent,
    DialogEditProdComponent,
    DialogAddProdComponent,
    DialogEditUserInfoComponent,
    DialogIncorrectCurrPwd,
    DialogChangePwdSucess,
    NavBarComponent,
    ChangePasswordComponent,
    ReviewPanelComponent
  ],

  providers: [
    EmailValidator,
    AlertService,
    AuthService,
    AuthGuard,
    UserService,
    FilterService,
    MfrService,
    AdminService,
    AddReviewService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogConfirmComponent,
    DialogEditProdComponent,
    DialogAddProdComponent,
    DialogEditUserInfoComponent,
    DialogIncorrectCurrPwd,
    DialogChangePwdSucess,
    ReviewPanelComponent]
})
export class AppModule { }
