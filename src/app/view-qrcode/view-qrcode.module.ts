import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewQRCodePageRoutingModule } from './view-qrcode-routing.module';

import { ViewQRCodePage } from './view-qrcode.page';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewQRCodePageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [ViewQRCodePage]
})
export class ViewQRCodePageModule {}
