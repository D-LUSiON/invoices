import * as core from '@angular/core';
import * as common from '@angular/common';
import * as forms from '@angular/forms';
import * as router from '@angular/router';
import * as rxjs from 'rxjs';
import * as tslib from 'tslib';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';

export const PLUGIN_EXTERNALS_MAP = {
    'ng.core': core,
    'ng.common': common,
    'ng.forms': forms,
    'ng.router': router,
    rxjs,
    tslib,
    'nz.menu': NzMenuModule,
    'nz.collapse': NzCollapseModule,
    'nz.tree': NzTreeModule,
    'nz.dropdown': NzDropDownModule,
    'nz.tabs': NzTabsModule,
    'nz.empty': NzEmptyModule,
    'nz.button': NzButtonModule,
    'nz.icon': NzIconModule,
    'ng.translate': TranslateModule,
};
