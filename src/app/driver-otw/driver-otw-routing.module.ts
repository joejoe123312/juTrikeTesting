import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverOtwPage } from './driver-otw.page';

const routes: Routes = [
  {
    path: '',
    component: DriverOtwPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverOtwPageRoutingModule {}
