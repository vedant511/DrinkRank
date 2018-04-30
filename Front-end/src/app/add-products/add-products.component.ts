import { Component, OnInit, NgModule, ChangeDetectorRef } from '@angular/core';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { User, Countries, BeverageClass } from '../_models';
import { MfrService } from '../_services';
import { MatInputModule, MatFormFieldModule, MatSelectModule } from '@angular/material';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})

@NgModule({
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule]
})

export class AddProductsComponent implements OnInit {

  private data = {};
  private currentUser: User;
  private errorStr: string;
  private cList = new Countries;
  private beverageClass = new BeverageClass();

  private beverageType: any;
  private catWine: any;
  private catBeer: any;
  private catCider: any;
  private catHardAlcohol: any;

  private addProductForm = new FormGroup({
    productName: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    beverageType: new FormControl('', Validators.required),
    category: new FormControl(''),
    alcohol: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    vintage: new FormControl('')
  });

  constructor(private mfrService: MfrService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.beverageType = this.beverageClass.beverageType;
    this.catWine = this.beverageClass.catWine;
    this.catBeer = this.beverageClass.catBeer;
    this.catCider = this.beverageClass.catCider;
    this.catHardAlcohol = this.beverageClass.catHardAlcohol;
    this.onChanges();
  }

  onChanges(): void {
    this.addProductForm.get('beverageType').valueChanges.map(
      value => {
        if (value === 'Wine' || value === 'Hard Alocohol') {
          this.addProductForm.get('vintage').setValidators(Validators.required);
        } else {
          this.addProductForm.get('vintage').clearValidators();
        }

        if (!(value === 'Others')) {
          this.addProductForm.get('category').setValidators(Validators.required);
        } else {
          this.addProductForm.get('category').clearValidators();
        }
      }
    );


  }

  onSubmit() {
    this.data['Alcohol'] = this.addProductForm.value['alcohol'];
    this.data['BeverageType'] = this.addProductForm.value['beverageType'];
    this.data['Country'] = this.addProductForm.value['country'];
    this.data['ManufacturerEmail'] = this.currentUser.EmailId;
    this.data['ManufacturerName'] = this.currentUser.Name;
    this.data['Name'] = this.addProductForm.value['productName'];
    this.data['Price'] = this.addProductForm.value['price'];
    this.data['Category'] = this.addProductForm.value['category'];
    this.data['Vintage'] = this.addProductForm.value['vintage'];

    if (this.data['BeverageType'] === 'Others') {
      this.data['Category'] = '';
    } else if (!(this.data['BeverageType'] === 'Wines') && !(this.data['BeverageType'] === 'Hard Alcohol')) {
      this.data['Vintage'] = 0;
    }

    console.log(this.data);
    this.mfrService.addProdcut(this.data)
      .subscribe(
        res => {
          console.log('[Debug] wineinsertion success\n', res);
          let tempData = [];
          tempData = JSON.parse(localStorage.getItem('productList'));
          tempData.push(res);
          localStorage.setItem('productList', JSON.stringify(tempData));
        },
        error => {
          console.log('[Debug] wineinsertion fail:\n', error);
        });
  } /* End of onSubmit() */

} /* End of Class */
