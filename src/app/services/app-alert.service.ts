import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';


@Injectable({ providedIn: 'root' })

export class AppAlertService {

  constructor(
    private toastr:ToastController,
    private loadingCtrl:LoadingController
  ) { }
 async presentToast(message,status,duration) {
      const toastr = await this.toastr.create({
        message: message,
        position: 'top',
        color: status,
        duration: duration
      });
      toastr.present();
    }
  
}
