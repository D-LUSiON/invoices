import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnonymousGuard, AuthGuard } from './guards';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        // loadChildren: './login/login.module#LoginModule',
        canActivate: [AnonymousGuard]
    },
    {
        path: 'logout',
        loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule),
        // loadChildren: './logout/logout.module#LogoutModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        // loadChildren: './home/home.module#HomeModule',
        canActivate: [AuthGuard]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
