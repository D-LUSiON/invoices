import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipientsListComponent } from './recipients-list/recipients-list.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RecipientsListComponent
    },
    {
        path: '*',
        redirectTo: ''
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipientsRoutingModule { }
