import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecondDropOffLocationPage } from './second-drop-off-location.page';

const routes: Routes = [
  {
    path: '',
    component: SecondDropOffLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecondDropOffLocationPageRoutingModule {}
