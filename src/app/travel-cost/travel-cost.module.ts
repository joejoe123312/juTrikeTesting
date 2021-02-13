import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelCostPageRoutingModule } from './travel-cost-routing.module';

import { TravelCostPage } from './travel-cost.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelCostPageRoutingModule
  ],
  declarations: [TravelCostPage]
})
export class TravelCostPageModule {}
