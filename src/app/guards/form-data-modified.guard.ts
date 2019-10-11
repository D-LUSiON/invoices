import { Injectable, HostListener } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class FormDataModifiedGuard implements CanDeactivate<CanComponentDeactivate> {

    constructor(
    ) {}

    // TODO: Make refreshing or closing the page on unsaved changes work!
    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (confirm('You might loose data! Are you sure?')) {
            $event.returnValue = true;
        }
    }

    canDeactivate(
        component?: CanComponentDeactivate,
        route?: ActivatedRouteSnapshot,
        state?: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (component.canDeactivate && !component.canDeactivate()) {
            if (confirm('Are you sure? You have unsaved changed!')) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

}
