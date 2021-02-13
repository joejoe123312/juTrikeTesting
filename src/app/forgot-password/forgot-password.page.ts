import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AppAlertService } from '../services/app-alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
email: string;
  constructor(
    private afauth: AngularFireAuth,
    private router: Router,
    private loadingCtrl: LoadingController,
    private appAlert: AppAlertService
  ) { }

  ngOnInit() {
  }

  async resetPassword()
  {
    if (this.email)
    {
      const loading = await this.loadingCtrl.create({
        message: 'Sending Reset password link..',
        spinner: 'crescent',
        showBackdrop: true
      });
      loading.present();
      this.afauth.sendPasswordResetEmail(this.email)
      .then(() => {
        loading.dismiss();
        this.appAlert.presentToast('Reset Password Link Sent!', 'success', 2500);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        loading.dismiss();
        this.appAlert.presentToast(error.message, 'danger', 2500);
      });
    }
    else{
      this.appAlert.presentToast('Please Enter Your Email Address!', 'warning', 2500);
    }
  }
}
