import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-review-panel',
  templateUrl: './review-panel.component.html',
  styleUrls: ['../../../node_modules/bootstrap/dist/css/bootstrap.min.css', './review-panel.component.css']
})
export class ReviewPanelComponent implements OnInit {

    tasteConfig = {
        'max': 10,
        'min': 0,
        'step': 1,
        'showTicks': false,
        'disabled': false,
        'invert': false,
        'thumbLabel': true,
        'value': 0,
        'vertical': false,
    };

    starConfig = {
        'max': 5,
        'min': 0,
        'step': 1,
        'showTicks': false,
        'disabled': false,
        'invert': false,
        'thumbLabel': true,
        'value': 0,
        'vertical': false,
    };

    userReview = {
        'Beverage ID': null,
        'Reviewer EmailId': null,
        'BeverageManufacturer': null,
        'SweetnessFelt': 0,
        'SournessFelt': 0,
        'BitternessFelt': 0,
        'Stars': 0,
        'Content': null
    };

  constructor(
      private dialog: MatDialogRef<ReviewPanelComponent>
  ) { }

  ngOnInit() {
  }

  postReview() {
      this.dialog.close(this.userReview);
  }

  closeDialog() {
      this.dialog.close();
  }
}
