import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateCurrentUserProfilePage } from './update-current-user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateCurrentUserProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateCurrentUserProfilePageRoutingModule {}
