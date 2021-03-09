import { Component, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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


declare var google: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    // @ViewChild('homeMap',  {static: false}) mapElement: ElementRef;
  
  mapShow:boolean;
  restartButtonShow:boolean = false;

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
  ) 
  {
   }
// tslint:disable-next-line: use-lifecycle-interface
  //LOAD THE MAP ONINIT.
  ionViewWillEnter() {
    // initiate map show default value is false
    this.mapShow = this.mapsService.getMapShowStatus();

    // initialize pickup and dropoff address
    this.getPickUpAndDropOffAddress();
    // alert('nag restart na ako nag click na ako ng button');
  }

  getPickUpAndDropOffAddress(){
    this.pickUpAddress = this.mapsService.getPickUpAddress();
    this.dropOffAddress = this.mapsService.getDropOffAddress();
  }


  //LOADING THE MAP HAS 2 PARTS.
  loadMap(startLat, startLng, endLat, endLng) {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(document.getElementById("homeMap"), {
    zoom: 20,
    center: { lat: 17.613419058438215, lng:121.72716086550331 },
    disableDefaultUI: true,
    restriction: {
      latLngBounds: {
        north: 17.6867129,
        south: 17.5174437,
        east: 121.8369136,
        west: 121.6820089,
      },
    },
  });
  directionsRenderer.setMap(map);
  // directionsRenderer.setPanel(document.getElementById("right-panel"));
  // const control = document.getElementById("floating-panel");
  // control.style.display = "block";
  // console.log(control.style.display);
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
/*   const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  document.getElementById("start").addEventListener("change", onChangeHandler);
  document.getElementById("end").addEventListener("change", onChangeHandler); */
  
  this.calculateAndDisplayRoute(directionsService, directionsRenderer, startLat, startLng, endLat, endLng);
}
 
 calculateAndDisplayRoute(directionsService, directionsRenderer, startLat, startLng, endLat, endLng) {
  const start = {lat: startLat, lng: startLng};
  const end = {lat: endLat, lng: endLng};
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
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

            this.readyForBooking = true;
        }

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
      if (dropOffLocation.location != null) {

        // get the latitude and longitude of the start and end locations
        
        var startLat = pickUpLocation.latitude;
        var startLng = pickUpLocation.longitude;
        var endLat = dropOffLocation.latitude;
        var endLng = dropOffLocation.longitude;
        this.loadMap(startLat, startLng, endLat, endLng);

        this.getDurationAndDistanec(startLat, startLng, endLat, endLng);
        console.clear();
        console.log('ready for booking set to true');
        this.readyForBooking = true;
        this.restartButtonShow = true;
      }else{
        console.clear();
        console.log('hindi nag set yung ready for booking');
      }

    });

    modal.onDidDismiss().then(() => {
      //  console.clear();
    });

    return await modal.present();
  }


  bookNow(){
    
    this.mapsService.updateDistanceAndEstimatedTime(this.distance, this.duration);

    this.router.navigate(['./travel-cost']);
  }
  
}




  