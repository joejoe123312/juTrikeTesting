import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewQRCodePageRoutingModule } from './view-qrcode-routing.module';

import { ViewQRCodePage } from './view-qrcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewQRCodePageRoutingModule
  ],
  declarations: [ViewQRCodePage]
})
export class ViewQRCodePageModule {}
