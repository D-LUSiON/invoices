import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { TranslateModule } from '@ngx-translate/core';

import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { KeysPipe } from './pipes/keys.pipe';
import { LogPipe } from './pipes/log.pipe';

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
    declarations: [
        KeysPipe,
        LogPipe,
    ],
    imports: [
        CommonModule,
        NzMenuModule,
        NzCollapseModule,
        NzTreeModule,
        NzDropDownModule,
        NzTabsModule,
        NzEmptyModule,
        NzIconModule,
        TranslateModule,
    ],
    exports: [
        NzMenuModule,
        NzCollapseModule,
        NzTreeModule,
        NzDropDownModule,
        NzTabsModule,
        NzEmptyModule,
        NzIconModule,
        TranslateModule,

        KeysPipe,
        LogPipe,
    ],
    providers: [
        {
            provide: NZ_ICONS,
            useValue: icons,
        }
    ]
})
export class SharedModule { }
