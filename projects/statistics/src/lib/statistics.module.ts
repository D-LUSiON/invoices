import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [
      StatisticsComponent
  ],
  imports: [
      SharedModule
  ],
  exports: [
    StatisticsComponent
  ]
})
export class StatisticsModule {
    readonly title = 'Statistics';
    readonly icon = 'mdl2-AreaChart';
    readonly sidebar_position = 'top';
    readonly sidebar_index = 65534;

    get sidebar() {
        return null;
    }

    get preview() {
        return null;
    }

    get edit() {
        return StatisticsComponent;
    }
}
