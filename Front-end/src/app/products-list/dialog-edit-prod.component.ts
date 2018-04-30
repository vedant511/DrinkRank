import { Component, OnInit, NgModule } from '@angular/core';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { User, Countries, BeverageClass } from '../_models';
import { MatInputModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { MatDialogRef, MatDialogModule } from '@angular/material';

@Component({
  selector: 'app-dialog-edit-prod',
  templateUrl: './dialog-edit-prod.component.html',
  styles: ['form { width: 580px; }']
})

@NgModule({
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule]
})

export class DialogEditProdComponent implements OnInit {

  private data = {};
  private currentUser: User;
  private cList = new Countries;
  private beverageClass = new BeverageClass();

  private beverageType: any;
  private catWine: any;
  private catBeer: any;
  private catCider: any;
  private catHardAlcohol: any;

  selectedName: any;
  selectedCountry: any;
  selectedType: any;
  selectedCat: any;
  selectedAlcohol: any;
  selectedPrice: any;
  selectedVintage: any;

  private editProductForm = new FormGroup({
    productName: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    beverageType: new FormControl('', Validators.required),
    category: new FormControl(''),
    alcohol: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    vintage: new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<DialogEditProdComponent>) { }

  ngOnInit() {
    this.beverageType = this.beverageClass.beverageType;
    this.catWine = this.beverageClass.catWine;
    this.catBeer = this.beverageClass.catBeer;
    this.catCider = this.beverageClass.catCider;
    this.catHardAlcohol = this.beverageClass.catHardAlcohol;
    this.onChanges();
  }

  onChanges(): void {
    this.editProductForm.get('beverageType').valueChanges.map(
      value => {
        if (value === 'Wine' || value === 'Hard Alocohol') {
          this.editProductForm.get('vintage').setValidators(Validators.required);
        } else {
          this.editProductForm.get('vintage').clearValidators();
        }

        if (!(value === 'Others')) {
          this.editProductForm.get('category').setValidators(Validators.required);
        } else {
          this.editProductForm.get('category').clearValidators();
        }
      }
    );
  }

  onSubmit() {
    this.data['Alcohol'] = this.editProductForm.value['alcohol'];
    this.data['BeverageType'] = this.editProductForm.value['beverageType'];
    this.data['Category'] = this.editProductForm.value['category'];
    this.data['Country'] = this.editProductForm.value['country'];
    this.data['Name'] = this.editProductForm.value['productName'];
    this.data['Price'] = this.editProductForm.value['price'];
    this.data['Vintage'] = this.editProductForm.value['vintage'];

    console.log(this.data['BeverageType']);

    if (this.data['BeverageType'] === 'Others') {
      this.data['Category'] = '';
    } else if (!(this.data['BeverageType'] === 'Wines') && !(this.data['BeverageType'] === 'Hard Alcohol')) {
      this.data['Vintage'] = 0;
    }

    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close(null);
  }

}
