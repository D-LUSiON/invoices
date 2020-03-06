import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    state$: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor() {
        console.log(`Hello from core app AppState service`);
    }

    hello(message: string) {
        console.log(message);
    }
}
