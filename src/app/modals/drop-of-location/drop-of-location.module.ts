import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DropOfLocationPageRoutingModule } from './drop-of-location-routing.module';

import { DropOfLocationPage } from './drop-of-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DropOfLocationPageRoutingModule
  ],
  declarations: [DropOfLocationPage]
})
export class DropOfLocationPageModule {}
