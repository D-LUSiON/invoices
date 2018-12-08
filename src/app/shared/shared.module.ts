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
    MatDatepickerModule
} from '@angular/material';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatCardModule,
        MatTableModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDatepickerModule,
    ],
    exports: [
        ReactiveFormsModule,
        HttpClientModule,
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDatepickerModule,
    ]
})
export class SharedModule { }
