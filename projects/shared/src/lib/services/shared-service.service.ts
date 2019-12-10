import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedServiceService {

    constructor() {
        console.log('Hello from shared service');
    }
}
