import { NgModule } from '@angular/core';
import { SendingComponent } from './sending.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PreviewComponent } from './preview/preview.component';



@NgModule({
  declarations: [SendingComponent, SidebarComponent, PreviewComponent],
  imports: [
  ],
  exports: [SendingComponent]
})
export class SendingModule {
    readonly title = 'Sending';
    readonly icon = 'mdl2-CheckList';

    get sidebar() {
        return SidebarComponent;
    }

    get preview() {
        return PreviewComponent;
    }

    get edit() {
        return null;
    }
}
