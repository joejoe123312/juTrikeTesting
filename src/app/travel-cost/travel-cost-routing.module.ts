import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravelCostPage } from './travel-cost.page';

const routes: Routes = [
  {
    path: '',
    component: TravelCostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelCostPageRoutingModule {}
