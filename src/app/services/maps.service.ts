import { Injectable } from '@angular/core';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  pickUpLocation: any = {
    latitude: null,
    longitude: null,
    location: null,
  };
  dropOfLocation: any = {
    latitude: null,
    longitude: null,
    location: null,
  };
  mapShow:boolean = false;
  

  constructor() { }

  getMapShowStatus(){
    return this.mapShow;
  }

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

  getPickUpAddress(){
    console.log(this.pickUpLocation.location);
    return this.pickUpLocation.location;
  }

  getDropOffAddress(){
    console.log(this.pickUpLocation.location);
    return this.dropOfLocation.location;
  }



  
}
