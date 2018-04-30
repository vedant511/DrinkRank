import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterService} from '../_services/filter.service';

@Component({
  selector: 'app-manufacturer-detail',
  templateUrl: './manufacturer-detail.component.html',
  styleUrls: ['../../../node_modules/bootstrap/dist/css/bootstrap.min.css', './manufacturer-detail.component.css']
})
export class ManufacturerDetailComponent implements OnInit {

  manuId = {
    EmailId : '',
    page_num : 1,
    num : 6,
    sort: 'Rating',
    order : true
  };
  manuWines: any;

  constructor(
      private filterService: FilterService,
      private route: ActivatedRoute
  ) { }

    ngOnInit() {
        this.getManufacturerWines();
    }

    getManufacturerWines(): void {
        this.manuId['EmailId'] = this.route.snapshot.paramMap.get('emailId');
        this.filterService.getManufacturerWines(this.manuId)
            .subscribe(detail => {
                console.log(detail);
                this.manuWines = detail;
            });
    }

    pageManufacturer(page): void {
        if (this.manuId.page_num !== page) {
            this.manuId.page_num = page;
            this.filterService.getManufacturerWines(this.manuId).subscribe(detail => {
                this.manuWines = detail;
            });
        }
    }

}
