import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CrudServiceService } from '../services/crud-service.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-travel-cost',
  templateUrl: './travel-cost.page.html',
  styleUrls: ['./travel-cost.page.scss'],
})
export class TravelCostPage implements OnInit {
  userInfo:object;
  fullName:string;

  constructor(
    private fauth : AuthService,
    private userService: UserServiceService,
    private crudService: CrudServiceService,
  ) { }

  ngOnInit() 
  {

  }
  proceed(){
    // configure object
    let objectSet = {
      "createdAt": Date.now(),
      "start_location": "Testing",
      "start_latitude": "testing",
      "start_longitude": "Testing",
      "end_location": "Testing",
      "end_latitude": "Testing",
      "end_longitude": "Testing",
      "distance": "5",
      "price": "100",
      "status": "finding",
      // "fullName": this.fullName,
      "mobile_number": "Hehe",
    }

    // create field in the db
    this.crudService.create('bookings', objectSet, '/driver-otw');
  }
}
