import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Route, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppAlertService } from '../services/app-alert.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-current-user-profile',
  templateUrl: './update-current-user-profile.page.html',
  styleUrls: ['./update-current-user-profile.page.scss'],
})
export class UpdateCurrentUserProfilePage implements OnInit {
userId:any;
name:string;
middle:string;
phone:string;
last:string;
user:any;
info:any;

  constructor
  (
        private afs: AngularFirestore,
        private auth: AuthService,
        private fauth: AngularFireAuth,
        private loadingCtrl:LoadingController,
        private appalert:AppAlertService,
        private toast:AppAlertService,
        private router:Router,

  ) { }

   ngOnInit()
  { 
    // this initialize the users information
    this.profileInfo()

  }
  //  this method let the user info automatically in the input fields
  profileInfo()
  {
     this.auth.user$.subscribe(user =>{
       this.userId = user.userId;
       this.name = user.firstName;
       this.last = user.LastName;
       this.phone = user.userPhone
     });
  }

  // This method let user update his profile
 async updateProfile()
  {
    if(this.name && this.phone && this.last )
    {
      const loading = await this.loadingCtrl.create({
      message:'Updating...',
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    this.afs.collection('user').doc(this.userId).set({
      'firstName' : this.name,
      'LastName' : this.last,
      'userPhone' : this.phone,
      'editAt':Date.now() 
    },{merge:true})
    .then(()=>{
      loading.dismiss();
      this.toast.presentToast('Your Profile is now updated!','success','3000');
      this.router.navigate(['/tabs/account']);
    })
    .catch(error =>{
      loading.dismiss();
      this.toast.presentToast(error.message,'danger',2500)
    })
    }
    else{
      this.toast.presentToast('Please Fill Up All Fields!','warning',2500)
    }
  }

}