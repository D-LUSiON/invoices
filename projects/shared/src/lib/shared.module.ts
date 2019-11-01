import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';

// import { NzMenuModule } from 'ng-zorro-antd/menu';
// import { NzCollapseModule } from 'ng-zorro-antd/collapse';
// import { NzTreeModule } from 'ng-zorro-antd/tree';
// import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
// import { NzTabsModule } from 'ng-zorro-antd/tabs';
// import { NzEmptyModule } from 'ng-zorro-antd/empty';
// import { NzButtonModule } from 'ng-zorro-antd';
// import { NzIconModule } from 'ng-zorro-antd/icon';
// import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        // NzMenuModule,
        // NzCollapseModule,
        // NzTreeModule,
        // NzDropDownModule,
        // NzTabsModule,
        // NzEmptyModule,
        // NzButtonModule,
        // NzIconModule,
        // TranslateModule,
    ],
    declarations: [SharedComponent],
    entryComponents: [SharedComponent],
    exports: [
        SharedComponent,
        // NzMenuModule,
        // NzCollapseModule,
        // NzTreeModule,
        // NzDropDownModule,
        // NzTabsModule,
        // NzEmptyModule,
        // NzButtonModule,
        // NzIconModule,
        // TranslateModule,
    ],
})
export class SharedModule {}
