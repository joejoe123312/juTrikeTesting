import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { LoadingController , ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AppAlertService } from './app-alert.service';
import { User } from '../models/users';

@Injectable()
export class AuthService 
{
  user$: Observable<User>;
  user: User;
  constructor(
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private router: Router,
    private LoadingCtrl: LoadingController,
    private toast: AppAlertService
  )
   { 
    this.user$ = this.afauth.authState
    .pipe(switchMap(user =>{
      if(user)
      {
        return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
      }else
      {
        return of(null);
      }
      })
    )
   } //end of constructor

   async signIn(email,password)
   {
     const loading = await this.LoadingCtrl.create({
       message: 'Authenticating..',
       spinner: 'crescent',
       showBackdrop:true
   });
    loading.present();
    
    this.afauth.setPersistence(firebase.default.auth.Auth.Persistence.LOCAL).then(()=>{
      this.afauth.signInWithEmailAndPassword(email,password)
      .then((data)=>{
        if(!data.user.emailVerified)
        {
          loading.dismiss();
          this.toast.presentToast('Please verify your email address!','warning',2000);
          this.afauth.signOut();

        }
        else
        {
          loading.dismiss();
          this.router.navigate(['/list']);
        }
      })
      .catch(error =>{
        loading.dismiss();
        this.toast.presentToast(error.message,'danger',2000);
      })
    })
    .catch(error =>{
      loading.dismiss();
      this.toast.presentToast(error.message,'danger',2000);
    });
   }
   
   async signOut()
   {
     const loading = await this.LoadingCtrl.create({
       spinner:'crescent',
       showBackdrop:true
     });
     loading.present();

     this.afauth.signOut()
     .then(()=> {
       loading.dismiss();
       this.router.navigate(['/login']);
     })
   }
  
    
}
