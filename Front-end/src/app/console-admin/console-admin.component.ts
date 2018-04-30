import { Component, OnInit } from '@angular/core';
import { AdminService } from '../_services/admin.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-console-admin',
  templateUrl: './console-admin.component.html',
  styleUrls: ['../../../node_modules/bootstrap/dist/css/bootstrap.min.css', './console-admin.component.css']
})
export class ConsoleAdminComponent implements OnInit {

  pending = true;
  approved = false;
  declined = false;
  cancelled = false;
  currentUser = new User;
  adminPosts: any;

  updateStatus = {
    action: null,
    ID: null
  }

  pendingPage = {
      page_num : 1,
      num : 5,
      sort: 'Rating',
      order : true
  };

  constructor(
      private adminService: AdminService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.pendingPage);
    this.adminService.fetchPending(this.pendingPage).subscribe( posts => {
        this.adminPosts = posts;
        console.log(this.adminPosts);
    });
  }

  fetchPendingPosts() {
    // this.pendingPage['Status'] = ['PA', 'PD', 'PU'];
    this.pendingPage['Status'] = 'PA,PD,PU';
    this.fetchPosts();
  }

  fetchApprovedPosts() {
      // this.pendingPage['Status'] = ['A', 'U'];
      this.pendingPage['Status'] = 'A,U';
      this.fetchPosts();
  }

  fetchDeclinedPosts() {
      // this.pendingPage['Status'] = ['D'];
      this.pendingPage['Status'] = 'D';
      this.fetchPosts();
  }

  fetchCancelledPosts() {
      // this.pendingPage['Status'] = ['CA', 'CU', 'CD'];
      this.pendingPage['Status'] = 'CA, CU, CD';
      this.fetchPosts();
  }

  fetchPosts() {
      console.log(this.pendingPage);
      this.adminService.fetchOther(this.pendingPage).subscribe( posts => {
          this.adminPosts = posts;
          console.log(this.adminPosts);
      });
  }

  approvePost(id): void {
    this.updateStatus.ID = id;
    this.updateStatus.action = 'Approve';
    this.adminService.updateNewPosts(this.updateStatus).subscribe( res => {
      console.log(res);
    });
  }

  declinePost(id) {
    this.updateStatus.ID = id;
    this.updateStatus.action = 'Cancel';
    this.adminService.updateNewPosts(this.updateStatus).subscribe( res => {
          console.log(res);
      });
  }

  tabSelected(id) {
    if (id === 'pending') {
        this.pending = true;
        this.approved = false;
        this.declined = false;
        this.cancelled = false;
        this.fetchPendingPosts();
    } else if (id === 'approved') {
        this.approved = true;
        this.declined = false;
        this.pending = false;
        this.cancelled = false;
        this.fetchApprovedPosts();
    } else if (id === 'declined') {
        this.declined = true;
        this.approved = false;
        this.pending = false;
        this.cancelled = false;
        this.fetchDeclinedPosts();
    } else if (id === 'cancelled') {
        this.cancelled = true;
        this.declined = false;
        this.approved = false;
        this.pending = false;
        this.fetchCancelledPosts();
    }
  }

}
