import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestingPagePageRoutingModule } from './testing-page-routing.module';

import { TestingPagePage } from './testing-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestingPagePageRoutingModule
  ],
  declarations: [TestingPagePage]
})
export class TestingPagePageModule {}
