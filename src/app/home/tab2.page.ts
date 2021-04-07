import { Component, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { User } from '../models/users';
import { AppAlertService } from '../services/app-alert.service';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ViewChild , ElementRef } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsService } from '../services/maps.service';

// for launching of modals
import { ModalController } from '@ionic/angular';
import { PickUpLocationPage } from '../modals/pick-up-location/pick-up-location.page';
import { DropOfLocationPage } from '../modals/drop-of-location/drop-of-location.page';

import { TravelServiceService } from '../services/travel-service.service';
import { SecondDropOffLocationPage } from '../second-drop-off-location/second-drop-off-location.page';

declare var google: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    // @ViewChild('homeMap',  {static: false}) mapElement: ElementRef;

  // mapShow:boolean;

  map: any;
  address:string;
  lat: string;
  long: string;

  // used when autocomplete has been clicked
  latitude: any;
  longitude: any;
  pickUpLocation: string;

  //pangalan kung nasan yung address
  pickUpAddress: string;
  dropOffAddress: string;

  dropOffLatitude: any;
  dropOffLongitude: any;
  dropOffLocation: any;

  selectDestination: boolean;

  // trigger ready for booking
  readyForBooking: boolean = false;

  distance: any;
  duration: any;

  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;

  // for the selections if single or dual
  commuterSelector:number = 1;
  sameDropOffLocation:boolean = true;

  secondDropOffAddress:string;

  secondPassengerName:string;

  constructor(
        private auth: AuthService,
        private afs: AngularFirestore,
        private loadingCtrl: LoadingController,
        private appalert: AppAlertService,
        private router: Router,
        private fauth: AngularFireAuth,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        public zone: NgZone,
        public mapsService: MapsService,
        // for launching modals
        public modalController: ModalController,
        public alertController: AlertController,
        private travelServices: TravelServiceService,
        public toastController: ToastController,
  )
  {
  }



// tslint:disable-next-line: use-lifecycle-interface
  //LOAD THE MAP ONINIT.
  ionViewWillEnter() {
    // initiate map show default value is false
    // this.mapShow = this.mapsService.getMapShowStatus();

    // initialize pickup and dropoff address
    this.getPickUpAndDropOffAddress();

    // initiate commuterSelector
    this.commuterSelector = this.travelServices.getCommuterSelector();
  }

  getPickUpAndDropOffAddress(){
    this.pickUpAddress = this.mapsService.getPickUpAddress();
    this.dropOffAddress = this.mapsService.getDropOffAddress();
  }

  //LOADING THE MAP HAS 2 PARTS.
  loadMap(startLat, startLng, endLat, endLng) {
  // const directionsRenderer = new google.maps.DirectionsRenderer();
  // const directionsService = new google.maps.DirectionsService();
  // const map = new google.maps.Map(document.getElementById("homeMap"), {
  //   zoom: 15,
  //   center: { lat: 17.613419058438215, lng:121.72716086550331 },
  //   disableDefaultUI: true,
  //   restriction: {
  //     latLngBounds: {
  //       north: 17.6867129,
  //       south: 17.5174437,
  //       east: 121.8369136,
  //       west: 121.6820089,
  //     },
  //   },
  // });
  // directionsRenderer.setMap(map);


  // this.calculateAndDisplayRoute(directionsService, directionsRenderer, startLat, startLng, endLat, endLng);s
}


calculateAndDisplayRoute(directionsService, directionsRenderer, startLat, startLng, endLat, endLng) {
  const start = {lat: startLat, lng: startLng};
  const end = {lat: endLat, lng: endLng};
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
        trafficModel: 'optimistic'
      }
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        // console.log(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

// Pwede mag lagaya nalang ng parameter for Start and DropOff origin.
getDurationAndDistanec(startLat, startLng, endLat, endLng) {

  const start = {lat: startLat, lng: startLng};
  const end = {lat: endLat, lng: endLng};
  const geocoder = new google.maps.Geocoder();
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
        this.appalert.presentToast('Error was: ' + status, 'danger',2000 );
      } else {
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        const distance = document.getElementById("distance");
        const duration = document.getElementById("duration");
        distance.innerHTML = "";
        duration.innerHTML = "";
        const showGeocodedAddressOnMap = function (asDestination) {
        };

        for (let i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;
          geocoder.geocode(
            { address: originList[i] },
            showGeocodedAddressOnMap(false)
          );

          for (let j = 0; j < results.length; j++) {
            geocoder.geocode(
              { address: destinationList[j] },
              showGeocodedAddressOnMap(true)
            );
            distance.innerHTML +=
              results[j].distance.text +
              "<br>";

              this.distance = results[j].distance.text;
          }
          for (let j = 0; j < results.length; j++) {
            geocoder.geocode(
              { address: destinationList[j] },
              showGeocodedAddressOnMap(true)
            );
            duration.innerHTML +=

              results[j].duration.text ;

              this.duration = results[j].duration.text;
            }
        }
      }
    }
  );
}

  readyForBookingValidator(startLat, startLng, endLat, endLng){
    // check if pick up location, drop off location and second drop off location is present (if second drop offlocation)
    let valid = true;

    if ((this.pickUpAddress == null) && (this.dropOffAddress == null)) {
        valid = false;

        // check if the user has clicked yes to yes to different drop off locations
        if (this.sameDropOffLocation == false) {
          // get second drop off location
          if (this.secondDropOffAddress == null) {
            valid = false;
          }
        }
    }

    // check if the user has clicked yes to yes to different drop off locations
    if (this.sameDropOffLocation == false) {
      // get second drop off location
      if (this.secondDropOffAddress == null) {
        valid = false;
        // console.log('ako yung nag activate', 'ako si second drop off address:', this.secondDropOffAddress);
      }
    }

    this.readyForBooking = valid;

    if (valid == true) {
      // get back here
      this.loadMap(startLat, startLng, endLat, endLng);
    }
  }

  async launchPickUpModal(){

    const modal = await this.modalController.create({
      component: PickUpLocationPage,
    });

    modal.onWillDismiss().then(() => {
      this.getPickUpAndDropOffAddress();

      // check if pick up location is not empty
      const pickUpLocation = this.mapsService.getPickUpLocation();
      const dropOffLocation = this.mapsService.getDropOffLocation();

      if ((pickUpLocation.latitude != null) && (pickUpLocation.longitude != null)) {

        // may mga laman yung mga latitude at longi
        this.selectDestination = true;

        // kapag gustong palitan ng user yung pick up location niya
        if ((dropOffLocation.latitude != null) && (dropOffLocation.longitude)) {
            var startLat = pickUpLocation.latitude;
            var startLng = pickUpLocation.longitude;
            var endLat = dropOffLocation.latitude;
            var endLng = dropOffLocation.longitude;
            this.loadMap(startLat, startLng, endLat, endLng);

            this.readyForBookingValidator(startLat, startLng, endLat, endLng);
          }

          // up the state.
          this.mapsService.updatePickUpLocation(pickUpLocation.latitude, pickUpLocation.longitude, pickUpLocation.location);
      }else{
        // walang laman yung lati saka longi
        this.pickUpAddress = null;
      }

    });

    return await modal.present();
  }

  async launchDropOffModal(){

    // DropOfLocationPage
    const modal = await this.modalController.create({
      component: DropOfLocationPage,
    });

     modal.onWillDismiss().then(() => {

      this.getPickUpAndDropOffAddress();

      // determine if drop off location is already set
      const dropOffLocation = this.mapsService.getDropOffLocation();
      const pickUpLocation = this.mapsService.getPickUpLocation();
      console.log(dropOffLocation, 'ako si drop off location na nasa on dismiss');
      if (dropOffLocation.location != null) {

        // get the latitude and longitude of the start and end locations

        var startLat = pickUpLocation.latitude;
        var startLng = pickUpLocation.longitude;
        var endLat = dropOffLocation.latitude;
        var endLng = dropOffLocation.longitude;

        this.getDurationAndDistanec(startLat, startLng, endLat, endLng);

        // console.log('ready for booking set to true');
        this.readyForBookingValidator(startLat, startLng, endLat, endLng);

        this.mapsService.updateDropOfLocation(dropOffLocation.latitude, dropOffLocation.longitude, dropOffLocation.location);
      }else{
        console.clear();
        console.log('hindi nag set yung ready for booking');
      }

    });

    modal.onDidDismiss().then(() => {
      //  console.clear();
      // this.readyForBookingValidator();
    });

    return await modal.present();
  }

  async secondDropOfLocation(){

    // DropOfLocationPage
    const modal = await this.modalController.create({
      component: SecondDropOffLocationPage,
    });

     modal.onWillDismiss().then(() => {
      this.getPickUpAndDropOffAddress();

      // determine if drop off location is already set
      const dropOffLocation = this.mapsService.getSecondDropOffLocation();
      const pickUpLocation = this.mapsService.getPickUpLocation();

      if (dropOffLocation != null) {

        // get the latitude and longitude of the start and end locations
        var startLat = pickUpLocation.latitude;
        var startLng = pickUpLocation.longitude;
        var endLat = dropOffLocation.latitude;
        var endLng = dropOffLocation.longitude;

        this.getDurationAndDistanec(startLat, startLng, endLat, endLng);

        let secondDropOffLocation = {
          pickUpLocation:pickUpLocation,
          dropOffLocation:dropOffLocation,
          secondDropOffLocationAddress: dropOffLocation.location,
        }

        this.travelServices.updateSecondDropOffLocation(secondDropOffLocation);

        // set the secondDropOffAddress for the second drop off address
        this.secondDropOffAddress = dropOffLocation;

        // UP THE STATE
        this.mapsService.updateSecondDropOffLocation(dropOffLocation.latitude, dropOffLocation.longitude, dropOffLocation.location);

        this.readyForBookingValidator(startLat, startLng, endLat, endLng);

      }else{
        // console.clear();
        console.log('hindi nag set yung ready for booking');
      }

    });

    modal.onDidDismiss().then(() => {
      //  console.clear();
    });

    return await modal.present();
  }


  bookNow(){
    this.mapsService.updateSecondPassengerName(this.secondPassengerName);

    this.mapsService.updateDistanceAndEstimatedTime(this.distance, this.duration);

    // UP THE STATE
    this.travelServices.updateCommuterSelectorAndSameDropOffLocation(this.commuterSelector, this.sameDropOffLocation);

    // validate if second passenger name is present.
    let valid = true;
    if ((this.secondPassengerName == null) && (this.commuterSelector == 2)) {
      valid = false;
      this.appalert.presentToast('Second passenger name is needed', 'danger', 4000 );
    }

    // validate if second passenger name is present.
    if (valid == true) {
      this.router.navigate(['./travel-cost']);
    }

  }

  singlePersonBtn(){
    this.commuterSelector = 1;
    console.clear();
  }

  async dualPersonBtn(){
    // change and move the selector
    this.travelServices.turnCommuterSelectorToTwo();
    this.commuterSelector = this.travelServices.getCommuterSelector();

    const dualPassengersToast = await this.toastController.create({
      header: 'Travel set to two drop off locations',
      duration: 4000,
      color: 'success',
      position: 'top',
    });

    const singlePassengerToast = await this.toastController.create({
      header: 'Travel set to a single drop off location',
      duration: 4000,
      color: 'success',
      position: 'top',
    });

    const alert = await this.alertController.create({
      header: 'Book with the same drop-off location?',
      // subHeader: 'Subtitle',
      // message: 'This is an alert message.',
      buttons: [
        {
          text: "No",
          handler: () => {
            // same locations
            this.travelServices.turnSameDropOffLocationToFalse();
            this.sameDropOffLocation = this.travelServices.getSameDropOffLocationValue(); // this will return false

            // update the mapsServices properties commuter selector and drop off location
            this.mapsService.updateCommuterSelectorSameDropOffLocation();

            // notify the user when they clicked no
            dualPassengersToast.present();
          }
        },
        {
          text: "Yes",
          role: 'cancel',
          handler: () => {
            this.travelServices.turnSameDropOffLocationToTrue();
            this.sameDropOffLocation = this.travelServices.getSameDropOffLocationValue(); // this will return true

            // update the mapsServices properties commuter selector and drop off location
            this.mapsService.updateCommuterSelectorSameDropOffLocation();

            singlePassengerToast.present();
          }
        }
      ]
    });

    await alert.present();

    console.clear();
    this.commuterSelector = 2;
  }

}




