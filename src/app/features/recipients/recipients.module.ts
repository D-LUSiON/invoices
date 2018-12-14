import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipientsRoutingModule } from './recipients-routing.module';
import { SharedModule } from '@app/shared';
import { RecipientsListComponent } from './recipients-list/recipients-list.component';

@NgModule({
    declarations: [RecipientsListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RecipientsRoutingModule
    ]
})
export class RecipientsModule { }
