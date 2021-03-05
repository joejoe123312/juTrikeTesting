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
  mapShow:boolean = true;
  
  // for current location
  currentLocLat: number;
  currentLocLong: number;
  

  constructor() { }

  getMapShowStatus(){
    return this.mapShow;
  }

  showMapPointAToB(){
    this.mapShow = true;
  }

  getPickUpLocation(){
    return this.pickUpLocation;
  }

  getDropOffLocation(){
    return this.dropOfLocation;
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
    return this.pickUpLocation.location;
  }

  getDropOffAddress(){
    return this.dropOfLocation.location;
  }

  
  
}
