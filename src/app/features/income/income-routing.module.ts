import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncomeListComponent } from './income-list/income-list.component';

const routes: Routes = [
    {
        path: '',
        component: IncomeListComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeRoutingModule { }
