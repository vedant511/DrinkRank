import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  returnUrl: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.logout();
  }


}
