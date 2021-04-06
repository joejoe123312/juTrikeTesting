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

  /* PRICE CALCULATION */

  calculateSinglePassenger(distance){
    let calculationResult = 35;
    if (distance <= 3) {
      // flat down rate lang ang kailangan
      return calculationResult;
    }else{
      let excess = distance - 3;
      let totalPayment = calculationResult + (excess * 13);
      return totalPayment;
    }
  }

  getDistanceFromString(distance:string){

    // remove the ' km'
    let removedKm = distance.substring(distance.lastIndexOf(" "), -1); // should return 2.1
    // console.log('ako si distance' ,typeof(removedKm));
    let result = parseFloat(distance);
    return result;

  }

  /* PRICE CALCULATION */


}
