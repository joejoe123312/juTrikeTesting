import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit {
  userInfo = {
    userId: null,
    firstname: null,
    lastname: null, 
    phoneNumber: null,
    fullName: null,
  };

  constructor(
    private router: Router,
    private userService: UserServiceService,
  ) { }

  async ngOnInit() {
    // get all of the user info and update the values in the user services 
    await this.userService.getCurrentUserInfo().then(status => {
      this.router.navigate(['./tabs/home']);
    }).catch(message => {
      console.log(message);
    });

  
    
  }

}
