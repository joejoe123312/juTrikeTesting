import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  // For the travel pick up location
  firstSummary: any = {
    pickUp : null,
    dropOff: null,
  };

  firstTravelTimeAndDistance: any = {
    startLat:null,
    startLng:null,
    endLat:null,
    endLng:null,
    distance:null,
    duration:null,
  };
  // for the travel pick up location

  // For the travel pick up location THIS IS FOR SECOND SUMMARY
  secondSummary: any = {
    pickUp : null,
    dropOff: null,
    timeAndDistance: null,
  }

  secondTravelTimeAndDistance:any = {
    startLat:null,
    startLng:null,
    endLat:null,
    endLng:null,
    distance:null,
    duration:null,
  };
  // FOR SECOND SUMMARY

  commuterSelector:number = null;
  sameDropOffLocation:boolean = true; // kapag nag null to commuter selector == 1,

  constructor(
    private fauth : AuthService,
    private userService: UserServiceService,
    private crudService: CrudServiceService,
    private mapsService: MapsService,
    private route: Router,
  ) { }

  async ionViewWillEnter()
  {

    // update the properties in the maps service which will get from the travele service
    await this.mapsService.updateCommuterSelectorSameDropOffLocation();

    // get the values of the properties from the updated maps service
    await this.updatePropertyCommuterSelectorSameDropOffLocation();

    // set the pick up location etc.. properties
    let pickUpLocation = this.mapsService.getPickUpLocation();
    let dropOffLocation = this.mapsService.getDropOffLocation();

    // construct the first summary object
    let startLat = pickUpLocation.latitude;
    let startLng = pickUpLocation.longitude;
    let endLat = dropOffLocation.latitude;
    let endLng = dropOffLocation.longitude;
    await this.constructFirstSummaryProperty(pickUpLocation, dropOffLocation, startLat, startLng, endLat, endLng);


    if ((this.commuterSelector == 2) && (this.sameDropOffLocation == false)) {
      // get the second pick up location.
      let secondDropOffLocation = this.mapsService.getSecondDropOffLocation();

      // construct second summary property
      startLat = pickUpLocation.latitude;
      startLng = pickUpLocation.longitude;
      endLat = secondDropOffLocation.latitude;
      endLng = secondDropOffLocation.longitude;
      await this.constructSecondSummaryProperty(pickUpLocation, secondDropOffLocation, startLat, startLng, endLat, endLng);

    }

    // if firstSummary.pickUp == null return to home.
    await this.middlewareDropOffPickUpLocation();
  }



  async constructSecondSummaryProperty(pickUpLocation: any, secondDropOffLocation: any, startLat, startLng, endLat, endLng) {
        // calculate the distance and duration
        await this.mapsService.getDurationAndDistance(startLat, startLng, endLat, endLng).then(returnValue => {

          let secondTravelTimeAndDistance = {
            startLat:startLat,
            startLng:startLng,
            endLat:endLat,
            endLng:endLng,
            distanceAndDuration: returnValue,
          };

          this.secondTravelTimeAndDistance = secondTravelTimeAndDistance;

          let secondSummaryObj = {
            pickUp: pickUpLocation.location,
            dropOff: secondDropOffLocation.location,
            distance: this.secondTravelTimeAndDistance.distanceAndDuration.distance,
            duration: this.secondTravelTimeAndDistance.distanceAndDuration.duration,
          };

          this.secondSummary = secondSummaryObj;
        });
  }

  async constructFirstSummaryProperty(pickUpLocation: any, dropOffLocation: any, startLat, startLng, endLat, endLng) {
    // calculate the distance and duration
    await this.mapsService.getDurationAndDistance(startLat, startLng, endLat, endLng).then(returnValue => {

      let firstTravelTimeAndDistance = {
        startLat:startLat,
        startLng:startLng,
        endLat:endLat,
        endLng:endLng,
        distanceAndDuration: returnValue,
      };

      this.firstTravelTimeAndDistance = firstTravelTimeAndDistance;


      let firstSummaryObj = {
        pickUp: pickUpLocation.location,
        dropOff: dropOffLocation.location,
        distance: this.firstTravelTimeAndDistance.distanceAndDuration.distance,
        duration: this.firstTravelTimeAndDistance.distanceAndDuration.duration,
      };
      this.firstSummary = firstSummaryObj;
    });

  }

  private updatePropertyCommuterSelectorSameDropOffLocation() {
    let commuterSelectorSameDropOffLocationValue = this.mapsService.getCommutereSelectorSameDropOffLocation();
    this.commuterSelector = commuterSelectorSameDropOffLocationValue.commuterSelector;
    this.sameDropOffLocation = commuterSelectorSameDropOffLocationValue.sameDropOffLocation;
  }

  // create a middleware when pick up location is null and drop off location is null redirect back to homepage
  async middlewareDropOffPickUpLocation(){

    if (this.firstSummary.pickUp == null) {
      this.route.navigate(['./tabs/home']);
    }

  }

  ngOnInit(){

  }


  async proceed(){

    // initialize current user info
    await this.userService.getCurrentUserInfo();
    let secondPassengerName = this.mapsService.getSecondPassengerName();
    let objectSet = {
      "createdAt": Date.now(),
      "quantity_of_commuters": this.commuterSelector, // will vary
      "first_summary": {
        startLat: this.firstTravelTimeAndDistance.startLat,
        startLng: this.firstTravelTimeAndDistance.startLng,
        endLat: this.firstTravelTimeAndDistance.endLng,
        endLng: this.firstTravelTimeAndDistance.endLng,
        distance: this.firstSummary.distance,
        duration: this.firstSummary.duration,
        price: 100,
      },
      "second_summary": null, // will change later if commuterSelector is 2 and sameDropOffLocation = false
      "second_passenger_name": secondPassengerName,
      "personal_information_passenger1": this.userService.getUserInfo(),
      "status": 'waiting',
    }

    // determine if there is need for the second_summary
    if (this.sameDropOffLocation == false) {
      objectSet.second_summary = {
        startLat: this.secondTravelTimeAndDistance.startLat,
        startLng: this.secondTravelTimeAndDistance.startLng,
        endLat: this.secondTravelTimeAndDistance.endLng,
        endLng: this.secondTravelTimeAndDistance.endLng,
        distance: this.secondSummary.distance,
        duration: this.secondSummary.duration,
        price: 100,
      }
    }

    console.log(objectSet);

    // // create field in the db
    this.crudService.create('bookings', objectSet, '/driver-otw');
  }
}
