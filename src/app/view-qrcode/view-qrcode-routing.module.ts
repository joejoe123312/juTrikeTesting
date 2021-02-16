import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewQRCodePage } from './view-qrcode.page';

const routes: Routes = [
  {
    path: '',
    component: ViewQRCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewQRCodePageRoutingModule {}
