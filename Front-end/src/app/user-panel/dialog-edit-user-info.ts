import { Component, NgModule } from '@angular/core';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { User, Countries } from '../_models';
import { MatInputModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { MatDialogRef, MatDialogModule } from '@angular/material';

@Component({
    selector: 'app-dialog-edit-user-info',
    templateUrl: './dialog-edit-user-info.html',
    styles: ['.form-edit-user-info { width: 300px; margin: auto; text-align: left;}']
})

@NgModule({
    imports: [MatInputModule, MatFormFieldModule, MatSelectModule]
})

export class DialogEditUserInfoComponent {

    private data = {};
    private currentUser: User;
    private cList = new Countries;

    oldName: any;
    oldCountry: any;
    oldPhone: any;

    private editUserInfoForm = new FormGroup({
        username: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
    });

    constructor(private dialogRef: MatDialogRef<DialogEditUserInfoComponent>) { }

    onSubmit() {
        this.data['Name'] = this.editUserInfoForm.value['username'];
        this.data['Country'] = this.editUserInfoForm.value['country'];
        this.data['Phone'] = this.editUserInfoForm.value['phone'];
        this.dialogRef.close(this.data);
    }

    onCancel() {
        this.dialogRef.close(null);
    }

}
