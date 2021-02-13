import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor
  (
    private actionSheetController:ActionSheetController,
    private router: Router,
  ) {}
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Edit Profile',
        role: 'Edit profile of user',
        icon: 'create',
        handler: () => {
            alert('Show Profile to edit.');
        }
      }, {
        text: 'Log out',
        icon: 'log-out',
        handler: () => {
          alert('Go to logout!');
          this.router.navigate(['./login']);
        }
      },]
    });
    await actionSheet.present();
  }
}
