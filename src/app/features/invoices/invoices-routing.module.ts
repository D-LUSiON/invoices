import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: InvoicesListComponent
    },
    {
        path: 'new',
        component: InvoiceEditComponent
    },
    {
        path: 'edit',
        pathMatch: 'full',
        redirectTo: ''
    },
    {
        path: 'edit/:id',
        component: InvoiceEditComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
