import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Route, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppAlertService } from '../services/app-alert.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  userInfo = {
    userId: null,
    firstname: null,
    lastname: null, 
    phoneNumber: null,
    fullName: null,
  };

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private fauth: AngularFireAuth,
    private loadingCtrl:LoadingController,
    private appalert:AppAlertService,
    private toast:AppAlertService,
    private router:Router,
  )
  {
  }

ngOnInit()
  {
    // console.log(this.getCurrentUserInfo,'tangina mo');
  }

  getCurrentUserInfo(){
    this.auth.user$.subscribe(user => {
      if (user)
      {
       this.userInfo.userId = user.userId;
       this.userInfo.firstname = user.firstName;
       this.userInfo.lastname = user.LastName;
       this.userInfo.phoneNumber = user.userPhone;
       this.userInfo.fullName = user.firstName + " " + user.LastName;

       return this.userInfo;
      }
     });
    
  }

  viewUserInfo(){
    return this.userInfo;
  }

}
