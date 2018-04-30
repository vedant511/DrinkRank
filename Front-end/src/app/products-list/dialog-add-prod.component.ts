import { Component, OnInit, NgModule } from '@angular/core';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { User, Countries, BeverageClass } from '../_models';
import { MatInputModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { MatDialogRef, MatDialogModule } from '@angular/material';
import { MfrService } from '../_services';

@Component({
  selector: 'app-dialog-add-prod',
  templateUrl: './dialog-add-prod.component.html',
  styleUrls: ['../../../node_modules/bootstrap/dist/css/bootstrap.min.css', './dialog-add-prod.component.css']
})

@NgModule({
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule]
})

export class DialogAddProdComponent implements OnInit {

  private currentUser: User;
  private errorStr: string;
  private cList = new Countries;
  private beverageClass = new BeverageClass();

  private beverageType: any;
  private catWine: any;
  private catBeer: any;
  private catCider: any;
  private catHardAlcohol: any;

  private prodData = {
    'SweetnessFelt': 0,
    'SournessFelt': 0,
    'BitternessFelt': 0,
  };

  private tasteConfig = {
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

  private addProductForm = new FormGroup({
    productName: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    beverageType: new FormControl('', Validators.required),
    category: new FormControl(''),
    alcohol: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    vintage: new FormControl('')
  });

  constructor(private mfrService: MfrService, private dialogRef: MatDialogRef<DialogAddProdComponent>) { }

  ngOnInit() {
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
    this.prodData['Alcohol'] = this.addProductForm.value['alcohol'];
    this.prodData['BeverageType'] = this.addProductForm.value['beverageType'];
    this.prodData['Category'] = this.addProductForm.value['category'];
    this.prodData['Country'] = this.addProductForm.value['country'];
    this.prodData['Name'] = this.addProductForm.value['productName'];
    this.prodData['Price'] = this.addProductForm.value['price'];
    this.prodData['Vintage'] = this.addProductForm.value['vintage'];

    if (this.prodData['BeverageType'] === 'Others') {
      this.prodData['Category'] = '';
    } else if (!(this.prodData['BeverageType'] === 'Wines') && !(this.prodData['BeverageType'] === 'Hard Alcohol')) {
      this.prodData['Vintage'] = 0;
    }

    this.dialogRef.close(this.prodData);
  }

  onCancel() {
    this.dialogRef.close(null);
  }

}
