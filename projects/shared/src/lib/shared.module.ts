import { NgModule } from '@angular/core';
import { AccordionComponent } from './accordion/accordion.component';
import { AccordionGroupComponent } from './accordion/accordion-group/accordion-group.component';
import { TabsComponent } from './tabs/tabs.component';
import { TreeComponent } from './tree/tree.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        AccordionComponent,
        AccordionGroupComponent,
        TabsComponent,
        TreeComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,

        AccordionComponent,
        AccordionGroupComponent,
        TabsComponent,
        TreeComponent
    ]
})
export class SharedModule { }
