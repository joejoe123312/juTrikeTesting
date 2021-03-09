import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppAlertService } from './app-alert.service';

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

  distance: number;
  estimatedTime: number;
  
  durationAndDistance:object;

  constructor(
    private appalert:AppAlertService,
  ) { }

  getDistanceAndEstimatedTime(){
    return {
      distance: this.distance,
      estimatedTime: this.estimatedTime,
    };
  }

  updateDistanceAndEstimatedTime(distance:number, estimatedTime:number){
    this.distance = distance;
    this.estimatedTime = estimatedTime;
  }

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

  
  /* COMMON GEOCODING METHODS */
  getDurationAndDistance(startLat, startLng, endLat, endLng) {
    return new Observable(observer => {
      const start = {lat: startLat, lng: startLng};
    const end = {lat: endLat, lng: endLng};
    
    let distance:string;
    let duration:string;
    let originList:any;
    let destinationList:any;

    let returnObj:any;
    
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [start],
        destinations: [end],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status !== "OK") {
          alert("Error was: " + status);
        } else {
          
          originList = response.originAddresses; // papakita niya yung address
          destinationList = response.destinationAddresses; // papakita niya yung address
          

          for (let i = 0; i < originList.length; i++) {
            const results = response.rows[i].elements;

            for (let j = 0; j < results.length; j++) {
                distance = results[j].distance.text;
            }
            
            for (let j = 0; j < results.length; j++) {
                duration = results[j].duration.text;
            }
          }
          
          
          returnObj = {
            origin: originList[0],
            destination: destinationList[0],
            distance: distance,
            duration: duration,
          };

          observer.next(returnObj);

          observer.complete(); 
        }
      }
    );

    }); 
  

  }
  /* COMMON GEOCODING METHODS */
  

}
