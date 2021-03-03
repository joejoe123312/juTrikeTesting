import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DropOfLocationPage } from './drop-of-location.page';

const routes: Routes = [
  {
    path: '',
    component: DropOfLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DropOfLocationPageRoutingModule {}
