import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchiveRoutingModule } from './archive-routing.module';
import { SharedModule } from '@app/shared';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedModule,
        ArchiveRoutingModule
    ]
})
export class ArchiveModule { }
