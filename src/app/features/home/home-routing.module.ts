import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'invoices',
        loadChildren: '../invoices/invoices.module#InvoicesModule'
    },
    {
        path: 'providers',
        loadChildren: '../providers/providers.module#ProvidersModule'
    },
    {
        path: 'recipients',
        loadChildren: '../recipients/recipients.module#RecipientsModule'
    },
    {
        path: 'archive',
        loadChildren: '../archive/archive.module#ArchiveModule'
    },
    {
        path: 'settings',
        loadChildren: '../settings/settings.module#SettingsModule'
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
