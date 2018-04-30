import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { AuthGuard} from './_guards/index';
import { NotFoundComponent } from './not-found/not-found.component';
import { LogoutComponent } from './logout/logout.component';
import { WineDetailComponent} from './wine-detail/wine-detail.component';
import { ManufacturerDetailComponent} from './manufacturer-detail/manufacturer-detail.component';
import { ChangePasswordComponent } from './user-panel/change-password/change-password.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'user-panel', component: UserPanelComponent, canActivate: [AuthGuard]},
  {path: '', component: HomeComponent },
  {path: 'wine/:id', component: WineDetailComponent},
  {path: 'manufacturer/:emailId', component: ManufacturerDetailComponent},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: '404', component: NotFoundComponent },
  {path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
