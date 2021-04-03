import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecondDropOffLocationPageRoutingModule } from './second-drop-off-location-routing.module';

import { SecondDropOffLocationPage } from './second-drop-off-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecondDropOffLocationPageRoutingModule
  ],
  declarations: [SecondDropOffLocationPage]
})
export class SecondDropOffLocationPageModule {}
