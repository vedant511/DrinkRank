import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-dialog-confirm',
    template: `
        <div mat-dialog-content>
            <p> Are you sure? </p>
        </div>
        <div mat-dialog-actions>
            <button mat-button mat-button color="primary" (click)="onNoClick()" > No </button>
            <button mat-button mat-button color="warn"(click)="onYesClick()"> Yes </button>
        </div>
        `
})

export class DialogConfirmComponent implements OnInit {

    constructor(private dialogRef: MatDialogRef<DialogConfirmComponent>) {}
    ngOnInit() {}

    onNoClick() {
        this.dialogRef.close(false);
    }

    onYesClick() {
        this.dialogRef.close(true);
    }
}
