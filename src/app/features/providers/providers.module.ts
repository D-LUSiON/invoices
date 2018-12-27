import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { SharedModule } from '@app/shared';
import { ProvidersListComponent } from './providers-list/providers-list.component';

@NgModule({
    declarations: [ProvidersListComponent],
    imports: [
        CommonModule,
        SharedModule,
        ProvidersRoutingModule
    ]
})
export class ProvidersModule { }
