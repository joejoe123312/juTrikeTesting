import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverOtwPageRoutingModule } from './driver-otw-routing.module';

import { DriverOtwPage } from './driver-otw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverOtwPageRoutingModule
  ],
  declarations: [DriverOtwPage]
})
export class DriverOtwPageModule {}
