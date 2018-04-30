import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FilterService } from '../_services/filter.service';
import { AddReviewService } from '../_services/add-review.service';
import { User } from '../_models/user';
import { ReviewPanelComponent} from '../review-panel/review-panel.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { filter} from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-wine-detail',
    templateUrl: './wine-detail.component.html',
    styleUrls: ['../../../node_modules/bootstrap/dist/css/bootstrap.min.css', './wine-detail.component.css']
})
export class WineDetailComponent implements OnInit {

    wineDetail: any;
    currentUser = new User;
    registeredUser = false;
    wineData: any;
    wineReviews: any;
    myRecaptcha: boolean;

    addReviewDialogRef: MatDialogRef<ReviewPanelComponent>;

    userReview: any;

    wineId = {
        ID: null,
        page_num: 1,
        num: 5,
        sort: '',
        order: true
    };

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private filterService: FilterService,
        private addReviewService: AddReviewService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(this.currentUser);
        if (this.currentUser !== null) {
            if (this.currentUser['UserGroup'] === 'isUser') {
                this.registeredUser = true;
                // console.log('I am here!');
            }
        }
        this.wineId.ID = +this.route.snapshot.paramMap.get('id');
        this.getWine();
    }

    getWine(): void {
        this.filterService.getWine(this.wineId)
            .subscribe(detail => {
                this.wineData = detail;
                this.wineDetail = this.wineData[0];
                this.wineReviews = this.wineData[1];
            });
    }

    postReview() {
        this.userReview['Beverage ID'] = this.wineId['ID'].toString();
        this.userReview['BeverageManufacturer'] = this.wineDetail['ManufacturerName'];
        this.userReview['Reviewer EmailId'] = this.currentUser['EmailId'];
        this.userReview.BitternessFelt = this.userReview.BitternessFelt.toString();
        this.userReview.SweetnessFelt = this.userReview.SweetnessFelt.toString();
        this.userReview.SournessFelt = this.userReview.SournessFelt.toString();
        this.userReview.Stars = this.userReview.Stars.toString();

        console.log(this.userReview);

        this.addReviewService.submitReview(this.userReview).subscribe(res => {
            console.log(res);
        });
    }

    openReviewDialog() {
        this.addReviewDialogRef = this.dialog.open(ReviewPanelComponent);
        this.addReviewDialogRef = this.addReviewDialogRef.updateSize('40%') ;

        this.addReviewDialogRef.afterClosed().subscribe( reviewData => {
            this.userReview = reviewData;
            console.log(this.userReview);
            if (typeof this.userReview !== 'undefined') {
                this.postReview();
            }
        });
    }
}
