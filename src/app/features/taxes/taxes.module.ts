import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxesRoutingModule } from './taxes-routing.module';
import { TaxesListComponent } from './taxes-list/taxes-list.component';

@NgModule({
  declarations: [TaxesListComponent],
  imports: [
    CommonModule,
    TaxesRoutingModule
  ]
})
export class TaxesModule { }
