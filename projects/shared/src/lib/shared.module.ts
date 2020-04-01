import { NgModule, ModuleWithProviders } from '@angular/core';
import { AccordionComponent } from './accordion/accordion.component';
import { AccordionGroupComponent } from './accordion/accordion-group/accordion-group.component';
import { TabsComponent } from './tabs/tabs.component';
import { TreeComponent } from './tree/tree.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ConsoleLogPipe } from './pipes/log.pipe';

@NgModule({
    declarations: [
        AccordionComponent,
        AccordionGroupComponent,
        TabsComponent,
        TreeComponent,
        AutocompleteComponent,
        ConsoleLogPipe,
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
        TreeComponent,
        AutocompleteComponent,
        ConsoleLogPipe,
    ]
})
export class SharedModule { }
