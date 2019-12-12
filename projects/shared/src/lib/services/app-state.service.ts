import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {

    constructor() {
        console.log(`Hello from AppStateService`);
    }
}
