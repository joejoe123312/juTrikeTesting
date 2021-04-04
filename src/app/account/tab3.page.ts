import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userInfo:any = {
    userId: null,
    firstname:null,
    fullname:null,
    lastname:null,
    phoneNumber:null,
    userEmail:null,
  };

  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private fauth: AngularFireAuth,
    private userService: UserServiceService,

  ) {}
  // tslint:disable-next-line: use-lifecycle-interface

  ionViewWillEnter(){
    this.userInfo = this.userService.viewUserInfo();

    if (this.userInfo.userId == null) {
      this.router.navigate(['./splash-screen']);
    }
  }

  ngOnInit()
  {
    this.userInfo = this.userService.viewUserInfo();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Edit Profile',
        role: 'Edit profile of user',
        icon: 'create',
        handler: () => {
        this.router.navigate(['updateCurrentUser']);
        }
      }, {
        text: 'Log out',
        icon: 'log-out',
        handler: () => {
        this.auth.signOut();
        }
      },
    ]
    });
    await actionSheet.present();
  }
}
