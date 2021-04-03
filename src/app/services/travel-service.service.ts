import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TravelServiceService {
  commuterSelector: number = 1;
  sameDropOffLocation: boolean  = null;

  // for second drop off location
  secondDropOffLocation:object;

  constructor() { }

  // update secondDropOffLocation
  updateSecondDropOffLocation(secondDropOffLocationObj){
    this.secondDropOffLocation = secondDropOffLocationObj;
  }

  // get dropOffLocation
  getSecondDropOffLocation(){
    return this.secondDropOffLocation;
  }

  // control commuterSelector Property
  getCommuterSelector(){
    return this.commuterSelector;
  }

  updateCommuterSelectorAndSameDropOffLocation(commuterSelector, sameDropOffLocation){
    this.commuterSelector = commuterSelector;
    this.sameDropOffLocation = sameDropOffLocation;
  }

  turnCommuterSelectorToTwo(){
    this.commuterSelector = 2;
  }

  turnCommuterSelectorToOne(){
    this.commuterSelector = 1;
  }

  // controll sameDropOffLocation property
  getSameDropOffLocationValue(){
    return this.sameDropOffLocation;
  }

  turnSameDropOffLocationToTrue(){
    this.sameDropOffLocation = true;
  }

  turnSameDropOffLocationToFalse(){
    this.sameDropOffLocation = false;
  }


}
