import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppAlertService } from '../services/app-alert.service'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  constructor
  (
    private router: Router,
    private auth: AuthService,
    private alert: AppAlertService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }
  async login()
  {
    if(this.email && this.password)
    {
    this.auth.signIn(this.email,this.password)
    } else {
    this.alert.presentToast('Please Enter Your Email and Password','warning',5000)
    }
  } //end of login
  



}
