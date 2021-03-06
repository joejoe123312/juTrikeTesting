import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CrudServiceService } from '../services/crud-service.service';
import { MapsService } from '../services/maps.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-travel-cost',
  templateUrl: './travel-cost.page.html',
  styleUrls: ['./travel-cost.page.scss'],
})
export class TravelCostPage implements OnInit {
  userInfo:object;
  fullName:string;
  
  pickUpLocation: any;
  dropOfLocation: any
  pickUpAddress:string;
  dropOffAddress: string;

  distance:any;
  duration:any;
  

  constructor(
    private fauth : AuthService,
    private userService: UserServiceService,
    private crudService: CrudServiceService,
    private mapsService: MapsService,
  ) { }

  async ionViewWillEnter() 
  {
    this.pickUpLocation = this.mapsService.getPickUpLocation();
    this.dropOfLocation = this.mapsService.getDropOffLocation();

    await this.processPickUpLocation();
    this.pickUpAddress = this.pickUpLocation.location;
    this.dropOffAddress = this.dropOfLocation.location;

    const timeAndDistance = this.mapsService.getDistanceAndEstimatedTime();
    this.distance = timeAndDistance.distance;
    this.duration = timeAndDistance.estimatedTime;
  }

  ngOnInit(){

  }

  processPickUpLocation(){
    if (this.pickUpLocation.location == "Pinned successfully") {
      let pickUpLocation = {...this.pickUpLocation};

      let replaceObj = {
        latitude: pickUpLocation.latitude,
        longitude: pickUpLocation.longitude,
        location: "Your Current Location",
      };
      
      this.pickUpLocation = replaceObj;
    }
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
