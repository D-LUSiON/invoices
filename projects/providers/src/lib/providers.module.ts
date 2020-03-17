import { NgModule } from '@angular/core';
import { EditComponent } from './edit/edit.component';
import { PreviewComponent } from './preview/preview.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from '@shared';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [EditComponent, PreviewComponent, SidebarComponent],
  imports: [
      CommonModule,
      SharedModule
  ],
  exports: [EditComponent, PreviewComponent, SidebarComponent]
})
export class ProvidersModule {
    readonly title = 'Providers';
    readonly icon = 'mdl2-ContactInfoMirrored';

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
