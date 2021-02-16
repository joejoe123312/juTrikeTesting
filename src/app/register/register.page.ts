import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AppAlertService } from '../services/app-alert.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  name:string;
  Last:string;
  fullName:string;
  email:string;
  password:string;
  phone:string;
  confirmPassword:string;
  passwordMatch: boolean;
  constructor
  (
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toast: AppAlertService,
    private router:Router
  ) { }

  ngOnInit() {
  }
  checkPassword()
  {
    if(this.password == this.confirmPassword)
    {
      this.passwordMatch = true;
    }
    else{
      this.passwordMatch = false;
    }
  }

  async register()
  {
    if(this.name && this.Last && this.phone && this.password)
    {
        const loading = await this.loadingCtrl.create({
          message: 'loading...',
          spinner: 'crescent',
          showBackdrop: true
        });
        loading.present();

        this.afauth.createUserWithEmailAndPassword(this.email,this.password).then((data)=>{
          data.user.sendEmailVerification();
          this.afs.collection('user').doc(data.user.uid).set({
            'userId':data.user.uid,
            'firstName' : this.name,
            'LastName':this.Last,
            // 'lastName:':this.last,
            'fullName':this.name + " " + this.Last ,
            'userEmail': this.email,
            'userPhone': this.phone,
            'createdAt' : Date.now()
        })
        .then(()=>{
          loading.dismiss();
          this.toast.presentToast('Registration Success! Your Verification Has Sent To Your Email!','primary',3000);
          this.router.navigate(['/login']);
        })
        .catch((error)=>{
          this.toast.presentToast(error.message,'danger',3000);
          loading.dismiss();
        })
      })
      .catch(error=>{
        loading.dismiss();
        this.toast.presentToast(error.message,'danger',3000);
      })
    }
    else{
        this.toast.presentToast('Please fill up all fields!','danger',3000);
    }
  }

}
