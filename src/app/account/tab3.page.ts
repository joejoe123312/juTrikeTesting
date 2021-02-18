import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  user: any;
  userId:any;
  todoId:string;
  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private fauth: AngularFireAuth,

  ) {}
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit()
  {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
      
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
