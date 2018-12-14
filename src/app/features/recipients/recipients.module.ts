import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipientsRoutingModule } from './recipients-routing.module';
import { SharedModule } from '@app/shared';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedModule,
        RecipientsRoutingModule
    ]
})
export class RecipientsModule { }
