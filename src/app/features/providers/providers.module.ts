import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { SharedModule } from '@app/shared';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedModule,
        ProvidersRoutingModule
    ]
})
export class ProvidersModule { }
