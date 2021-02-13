import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
user: any;
  constructor(
        private auth: AuthService
  ) {}
// tslint:disable-next-line: use-lifecycle-interface
ngOnInit()
   {
    this.auth.user$.subscribe(user =>
      {
      this.user = user;
    });
  }
}
