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
    @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string; 

  // used when autocomplete has been clicked
  latitude: any;
  longitude: any;
  pickUpLocation: string;

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
  ngOnInit() {
    this.loadMap();    
    this.getDurationAndDistanec();
  }

  //LOADING THE MAP HAS 2 PARTS.
  loadMap() {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(document.getElementById("map"), {
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
  directionsRenderer.setPanel(document.getElementById("right-panel"));
  const control = document.getElementById("floating-panel");
  control.style.display = "block";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
/*   const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  document.getElementById("start").addEventListener("change", onChangeHandler);
  document.getElementById("end").addEventListener("change", onChangeHandler); */
  this.calculateAndDisplayRoute(directionsService, directionsRenderer);
}
 
 calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const start = {lat: 17.613236739787514, lng: 121.72725845926294};
  const end = {lat: 17.629760901798956, lng: 121.73335336686061};
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
getDurationAndDistanec() {

  const start = {lat: 17.613236739787514, lng: 121.72725845926294};
  const end = {lat: 17.629760901798956, lng: 121.73335336686061};
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
          }
          for (let j = 0; j < results.length; j++) {
            geocoder.geocode(
              { address: destinationList[j] },
              showGeocodedAddressOnMap(true)
            );
            duration.innerHTML +=

              results[j].duration.text 
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
    
    return await modal.present();
  }

  async launchDropOffModal(){

    // DropOfLocationPage
    const modal = await this.modalController.create({
      component: DropOfLocationPage,
    });

    return await modal.present();
  }
  
}




  