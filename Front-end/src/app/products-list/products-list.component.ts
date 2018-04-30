import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/index';
import { JsonPipe } from '@angular/common';
import { MfrService } from '../_services';
import { DialogConfirmComponent } from '../_directives/dialog-confirm.component';
import { DialogEditProdComponent } from './dialog-edit-prod.component';
import { DialogAddProdComponent } from './dialog-add-prod.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})


export class ProductsListComponent implements OnInit {
  private displayedColumns = [
    'ID', 'Name', 'BeverageType', 'Category',
    'Country', 'Vintage',
    'Alcohol', 'Price',
    'Sweetness', 'Sourness', 'Bitterness',
    'Status', 'Management'];
  private dataSource = new MatTableDataSource();
  private currentUser = new User;
  private dialogConfirmRef: MatDialogRef<DialogConfirmComponent>;
  private dialogAddProdRef: MatDialogRef<DialogAddProdComponent>;
  private dialogEditProdRef: MatDialogRef<DialogEditProdComponent>;

  constructor(public dialog: MatDialog, private http: HttpClient, private mfrService: MfrService,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.refresh();
  }

  refresh() {
    /* check if local storage has product list of not */
    //if (JSON.parse(localStorage.getItem('productList')) === null) {
    console.log('[Debug] Query prodcut list');
    this.mfrService.getProdcutList(this.currentUser.Name, this.currentUser.EmailId)
      .subscribe(res => {
        //console.log('[Debug] getProdcutList res\n', res);
        if (res['Count'] !== 0) {
          localStorage.setItem('productList', JSON.stringify(res.Items));
          this.dataSource.data = res.Items;
          this.dataSource.paginator = this.paginator;
        }
      });
    //} else {
    //  console.log('[Debug] Access loacl prodcut list');
    //  this.dataSource = JSON.parse(localStorage.getItem('productList'));
    //  this.dataSource.paginator = this.paginator;
    //}
    this.changeDetectorRef.detectChanges();
  }

  /* Filter bar  */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /* Add new product to database  */
  onAddProd() {
    const dialogAddRef = this.dialog.open(DialogAddProdComponent);
    dialogAddRef.disableClose = true;
    dialogAddRef.afterClosed().subscribe(newProd => {
      if (!(newProd == null)) {
        newProd['ManufacturerEmail'] = this.currentUser.EmailId;
        newProd['ManufacturerName'] = this.currentUser.Name;
        console.log(newProd);
        this.mfrService.addProdcut(newProd)
          .subscribe(res => {
            //console.log('[wineinsertion ] res ', res);
            /* Update local storage */
            //const tempData = JSON.parse(localStorage.getItem('productList'));
            //tempData.push(res);
            //localStorage.setItem('productList', JSON.stringify(tempData));
            this.refresh();
          });
      }
    });
  }

  /* Upate the information of a product */
  onEditProd(row, idx) {
    //console.log('editProd()');
    const dialogEditProdRef = this.dialog.open(DialogEditProdComponent);
    dialogEditProdRef.disableClose = true;

    /* Read the information of current row and pass to the dialog window */
    dialogEditProdRef.componentInstance.selectedName = row.Name;
    dialogEditProdRef.componentInstance.selectedType = row.BeverageType;
    dialogEditProdRef.componentInstance.selectedCat = row.Category;
    dialogEditProdRef.componentInstance.selectedCountry = row.Country;
    dialogEditProdRef.componentInstance.selectedPrice = row.Price;
    dialogEditProdRef.componentInstance.selectedAlcohol = row.Alcohol;
    dialogEditProdRef.componentInstance.selectedVintage = row.Vintage;

    /* After the user close the dialog, modify the return ressult */
    /* and then make the api call */
    dialogEditProdRef.afterClosed().subscribe(result => {
      if (!(result === null)) {
        //console.log(result);
        result['ID'] = row.ID;
        result['ManufacturerEmail'] = this.currentUser.EmailId;
        result['ManufacturerName'] = this.currentUser.Name;
        this.mfrService.editProdcut(result)
          .subscribe(res => {
            //console.log('[wineupdate] res ', res);

            /* Update local storage */
            //const tempData = JSON.parse(localStorage.getItem('productList'));
            //delete res['Message'];
            //tempData[idx] = res;
            //localStorage.setItem('productList', JSON.stringify(tempData));
            this.refresh();
          });
      }
    });
  }

  /* Delete a product */
  onDelProd(row, idx) {
    const dialogRef = this.dialog.open(DialogConfirmComponent);
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        //console.log('Delete ID ', row.ID);
        this.mfrService.delProdcut(row.ID)
          .subscribe(res => {
            //console.log('[Delete] ', res);
            /* Update local storage */
            //const tempData = JSON.parse(localStorage.getItem('productList'));
            //tempData.splice(idx, 1);
            //localStorage.setItem('productList', JSON.stringify(tempData));
            this.refresh();
          });
      }
    });
  }

} /* End of OnInit */

