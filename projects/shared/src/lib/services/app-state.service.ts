import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppStateSharedService {
    state$: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor() {
        console.log(`Hello from AppStateSharedService`);
    }
}
