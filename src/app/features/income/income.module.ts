import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeRoutingModule } from './income-routing.module';
import { IncomeListComponent } from './income-list/income-list.component';

@NgModule({
  declarations: [IncomeListComponent],
  imports: [
    CommonModule,
    IncomeRoutingModule
  ]
})
export class IncomeModule { }
