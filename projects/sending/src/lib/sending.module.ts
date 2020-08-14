import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PreviewComponent } from './preview/preview.component';
import { SharedModule } from '@shared';
import { EditComponent } from './edit/edit.component';



@NgModule({
  declarations: [SidebarComponent, PreviewComponent, EditComponent],
  imports: [
      SharedModule
  ],
  exports: []
})
export class SendingModule {
    readonly title = 'Sending';
    readonly icon = 'mdl2-CheckList';
    readonly sidebar_position = 'top';
    readonly sidebar_index = 2;

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
