
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        // private _authService: AuthService,
        private _router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // return this._authService.currentAccount$.pipe(map((account) => {
        //     if (account && account.id) {
        //         return true;
        //     } else {
        //         this._router.navigate(['/login']);
        //         return false;
        //     }
        // }));
        return true;
    }
}
