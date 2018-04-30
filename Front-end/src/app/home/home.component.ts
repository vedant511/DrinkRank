import { Component, OnInit } from '@angular/core';
import { FilterService} from '../_services/filter.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../node_modules/bootstrap/dist/css/bootstrap.min.css', './home.component.css']
})
export class HomeComponent implements OnInit {
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

    priceConfig = {
        'max': 500,
        'min': 0,
        'step': 1,
        'showTicks': false,
        'disabled': false,
        'invert': false,
        'thumbLabel': true,
        'value': 0,
        'vertical': false,
    };

    alcoholConfig = {
        'max': 15,
        'min': 10,
        'step': 1,
        'showTicks': false,
        'disabled': false,
        'invert': false,
        'thumbLabel': true,
        'value': 0,
        'vertical': false,
    };

    vintageConfig = {
        'max': 2018,
        'min': 2005,
        'step': 1,
        'showTicks': false,
        'disabled': false,
        'invert': false,
        'thumbLabel': true,
        'value': 2005,
        'vertical': false,
    };

    ratingConfig = {
        'max': 5,
        'min': 1,
        'step': 1,
        'showTicks': false,
        'disabled': false,
        'invert': false,
        'thumbLabel': true,
        'value': 3,
        'vertical': false,
    };

    searchFilter = {
        manufacturer: null,
        term: null,
        Bitterness: null,
        Sweetness: null,
        Sourness: null,
        Price: null,
        Alcohol: null,
        Vintage: null,
        Rating: null,
        sort: 'Rating',
        page_num: 1,
        order: true,
        num: 5
    };

    winePage = {
        page_num : 1,
        num : 5,
        sort : 'Rating',
        order : true
    };

    manufacturerPage = {
        page_num : 1,
        num : 5,
        order : true
    };

  emptyTerms = false;
  filterResults: any;
  topWines: any;
  topManufacturers: any;
  searchResult = false;
  noResult = false;
  wineLoading = true;
  manufacturerLoading = true;
  filterLoading = false;

  constructor(
      private filterService: FilterService,
  ) { }

  ngOnInit() {
    this.filterService.getTopWines(this.winePage).subscribe(res => {
       this.topWines = res;
       this.wineLoading = false;
    });

      this.filterService.getTopManufacturers(this.manufacturerPage).subscribe(res => {
          this.topManufacturers = res;
          this.manufacturerLoading = false;
      });
  }

  searchWines(): void {
      console.log(this.searchFilter);
      if (this.searchFilter.term === null || this.searchFilter.term === '') {
          this.emptyTerms = true;
          this.searchResult = false;
      } else {
            this.emptyTerms = false;
            this.searchResult = true;
            this.filterLoading = true;
            this.filterWines();
      }
  }

  filterWines() {
      console.log(this.searchFilter);
      this.filterService.searchWines(this.searchFilter).subscribe(data => {
          console.log(data);
          this.filterResults = data;
          this.filterLoading = false;
          if (this.filterResults.length === 0) {
              this.noResult = true;
          } else {
              this.noResult = false;
          }
      });
  }

  resetFilter() {
      this.searchFilter.Bitterness = null;
      this.searchFilter.Sweetness = null;
      this.searchFilter.Sourness = null;
      this.searchFilter.Price = null;
      this.searchFilter.Alcohol = null;
      this.searchFilter.Vintage = null;
      this.searchFilter.Rating = null;
  }

  pageWine(page): void {
        if (this.winePage.page_num !== page) {
            this.winePage.page_num = page;
            this.filterService.getTopWines(this.winePage).subscribe(res => {
                this.topWines = res;
            });
        }
    }

    pageManufacturer(page): void {
        if (this.manufacturerPage.page_num !== page) {
            this.manufacturerPage.page_num = page;
            this.filterService.getTopManufacturers(this.manufacturerPage).subscribe(res => {
                this.topManufacturers = res;
            });
        }
    }
}


