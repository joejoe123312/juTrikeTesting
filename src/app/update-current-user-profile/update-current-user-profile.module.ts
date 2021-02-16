import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateCurrentUserProfilePageRoutingModule } from './update-current-user-profile-routing.module';

import { UpdateCurrentUserProfilePage } from './update-current-user-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateCurrentUserProfilePageRoutingModule
  ],
  declarations: [UpdateCurrentUserProfilePage]
})
export class UpdateCurrentUserProfilePageModule {}
