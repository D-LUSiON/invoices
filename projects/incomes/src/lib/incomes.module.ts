import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PreviewComponent } from './preview/preview.component';
import { EditComponent } from './edit/edit.component';



@NgModule({
    declarations: [
        SidebarComponent,
        PreviewComponent,
        EditComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        SidebarComponent,
        PreviewComponent,
        EditComponent
    ]
})
export class IncomesModule {
    readonly title = 'Incomes';
    readonly icon = 'mdl2-Bank';
    readonly sidebar_position = 'top';
    readonly sidebar_index = 1;

    get sidebar() {
        return SidebarComponent;
    }

    get preview() {
        return PreviewComponent;
    }

    get edit() {
        return EditComponent;
    }
}
