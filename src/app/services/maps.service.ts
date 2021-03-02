import { Injectable } from '@angular/core';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  pickUpLocation: any;
  dropOfLocation: any;
  

  constructor() { }

  getPickUpLocation(){
    return this.pickUpLocation;
  }

  updatePickUpLocation(latitude, longitude, location){
    const appendObj = {
      latitude: latitude,
      longitude: longitude,
      location: location
    }

    this.pickUpLocation = appendObj;
  }

  updateDropOfLocation(latitude, longitude, location){
    const appendObj = {
      latitude: latitude,
      longitude: longitude,
      location: location
    }

    this.dropOfLocation = appendObj;
  }



  
}
