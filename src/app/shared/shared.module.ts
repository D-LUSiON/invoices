import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
} from '@angular/material';
import { InvoiceEditComponent } from './components';
import { DialogModule } from './dialog/dialog.module';

@NgModule({
    declarations: [
        InvoiceEditComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatCardModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,

        DialogModule,
    ],
    exports: [
        ReactiveFormsModule,
        HttpClientModule,
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,

        DialogModule,

        InvoiceEditComponent,
    ],
    providers: [
        MatDatepickerModule,
    ],
})
export class SharedModule { }
