import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import { NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { User } from '../../models/users';
import { AppAlertService } from '../../services/app-alert.service';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ViewChild , ElementRef } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsService } from '../../services/maps.service';
import { ToastController } from '@ionic/angular';


declare var google: any;

@Component({
  selector: 'app-drop-of-location',
  templateUrl: './drop-of-location.page.html',
  styleUrls: ['./drop-of-location.page.scss'],
})
export class DropOfLocationPage implements OnInit {
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  modalTitle: string;
  modelId: number;
  map: any;
  address:any;
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

  // current location of the user lat and long
  currentUserLat: number;
  currentUserLong: number;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
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
    public toastController: ToastController,
  )
  {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    const geocoder = new google.maps.Geocoder();
   }

   async ngOnInit() {
     await this.loadMap();
     await this.setCurrentLocation();
  }

   async closeModal() {
    await this.modalController.dismiss();
  }

  setCurrentLocation(){
    return new Promise(resolve => {
      this.geolocation.getCurrentPosition().then(resp => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;

        if (this.latitude != null) {
          resolve('Done');
        }
      });
    });
  }

   //LOADING THE MAP HAS 2 PARTS.
   async loadMap() {
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();

    //FIRST GET THE LOCATION FROM THE DEVICE.
    this.geolocation.getCurrentPosition().then((resp) => {
      // 17.6578, 121.7083

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 17,
        disableDefaultUI: true,
        restriction: {
          latLngBounds: {
            north: 17.6867129,
            south: 17.5174437,
            east: 121.8369136,
            west: 121.6820089,
          },
        },
        // mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      latLng = new google.maps.Map(document.getElementById('mapDrop'), mapOptions);

      //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
      console.log(resp.coords.latitude, resp.coords.longitude, 'ako yung asa load map');

      // set the response to the property to be checked later if it takes too long to get the response
      this.currentUserLat = resp.coords.latitude;

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(document.getElementById('mapDrop'), mapOptions);
      this.map.addListener('tilesloaded', () => {
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
      });
      this.getAddressfromLatLong(resp.coords.latitude, resp.coords.longitude);

      // loading.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }




  getAddressFromCoords(lattitude, longitude) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
        console.log('asa baba ako ni address.slice');
      })
      .catch((error) =>{
        this.address = "Address Not Available!";
        // alert(error);
      });
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords(){
    alert('lat' +this.lat+', long'+this.long )
    this.getAddressFromCoords(this.lat, this.long);
  }

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults(searchValue:string){
    this.autocomplete.input = searchValue;

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }

    const defaultBounds = {
      north: 17.6867129,
      south: 17.5174437,
      east: 121.8369136,
      west: 121.6820089,
    };

    let request = {
      input: this.autocomplete.input,
      bounds: defaultBounds,
      componentRestrictions: { country: "ph" },
      // location: defaultBounds,
      // radius: 1500,
      
    }

    this.GoogleAutocomplete.getPlacePredictions(request,
    (predictions, status) => {
      if (predictions != null) {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      }else{
        this.autocompleteItems = [];
      }
    });
  }

  //wE CALL THIS FROM EACH ITEM.
  async SelectSearchResult(item) {
    ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    let address = item.description;

    this.pickUpLocation = address;

    var geocoder = new google.maps.Geocoder();

    await geocoder.geocode( { 'address': address }, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
          const lat = results[0].geometry.location.lat();
          const long = results[0].geometry.location.lng();

          // CHange the pointer
          // Dito yung taas
          let latLng = new google.maps.LatLng(lat, long);
            let mapOptions = {
              gestureHandling: "none",
              center: latLng,
              zoom: 17,
              disableDefaultUI: true,
              restriction: {
                latLngBounds: {
                  north: 17.6867129,
                  south: 17.5174437,
                  east: 121.8369136,
                  west: 121.6820089,
                },
              },
              // mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            // latLng = new google.maps.Map(document.getElementById('mapDrop'), mapOptions);
            this.map = new google.maps.Map(document.getElementById('mapDrop'), mapOptions);
        }

        

    });
    await this.convertAddressToLatLong(address);

    // update maps service so you can use the data in other pages

    this.mapsService.updateDropOfLocation(this.latitude, this.longitude, this.pickUpLocation);
    console.log(this.latitude, this.longitude, this.pickUpLocation);

    // console.log(this.mapsService.getPickUpLocation());

    this.ClearAutocomplete();
    // this.closeModal();

  }

   async convertAddressToLatLong(address){

    var geocoder = new google.maps.Geocoder();

    return new Promise(resolve => {
      geocoder.geocode( { 'address': address}, (results, status) => {

        if (status == google.maps.GeocoderStatus.OK) {
            const lat = results[0].geometry.location.lat();
            const long = results[0].geometry.location.lng();

            this.latitude = lat;
            this.longitude = long;

            if (this.latitude != null && this.longitude != null) {
              resolve('Ok');
            }
          }
      });
    });
  }


  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }
  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo(){
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id='+this.placeid;
  }

  async confirmLocation(){
    const loading =  await this.loadingCtrl.create({
      message: "Pinning your address"
    });
    await loading.present();

    /* kapag wala pa yung pick up location in less than N milli seconds throw an error */
    this.validatePickUpLocation(loading, 1000);

    // check if location is already set
    if (this.lat == null) {
      this.setCurrentLocation();
    }


    // get the location address name
    this.getAddressFromCoords(this.lat, this.long);
    console.clear();
    // use reverse geocoding

    let addressUsed = null;
    await this.mapsService.getAddressfromLatLong(this.lat, this.long).subscribe(observedValue => {
      this.address = observedValue;
      console.log(typeof(this.address), 'ako dapat yung mauuna');

      console.log(this.lat, this.long, addressUsed, 'ako dapat yung mahuhuli');

      if (this.address == 'Address Not Available!') {
        this.address = 'Pinned successfully';
      }

      this.mapsService.updateDropOfLocation(this.lat, this.long, this.address);

      loading.dismiss();
      this.closeModal();
    });



    // // console.log(this.lat, this.long, this.address);


  }

  // an observable that will count how long will the system process the confirm button.
  // it will also activate when i takes too long
  async validatePickUpLocation(loading:any, waitingTime:number,){

    const toast = await this.toastController.create({
      header: 'Slow internet connection',
      message: 'Please confirm again',
      position: 'top',
      duration: 5000,
      color: 'warning',
    });

    /* CREATE OBSERVERS */
    // VALIDATE LATITUDE ---------
    let validateLatitude = new Observable(observer => {

      setTimeout(() => {
        // check if may nalagay na values sa pick up location
        var pickUpLocationValue = this.mapsService.getPickUpLocation();
        observer.next(pickUpLocationValue.latitude);
        observer.complete();
      }, waitingTime);
    });
    // END VALIDATE LATITUDE ------

     // VALIDATE LATITUDE ---------
    let validateLongitude = new Observable(observer => {

      setTimeout(() => {
        // check if may nalagay na values sa pick up location
        var pickUpLocationValue = this.mapsService.getPickUpLocation();
        observer.next(pickUpLocationValue.longitude);
        observer.complete();
      }, waitingTime);
    });
    // END VALIDATE LATITUDE ------
    /* CREATE OBSERVERS */

    /* CREATE SUBSCRIBERS */
    validateLatitude.subscribe(observedValue => {
      if (observedValue == null) {
        loading.dismiss();
        toast.present();
      }
    });

    validateLongitude.subscribe(observedValue => {
      if (observedValue == null) {
        loading.dismiss();
        toast.present();
      }
    });
    /* END SUBSCRIBERS */

    // permission to close the modal
    validateLongitude.subscribe(observableValue => {
      if (observableValue != null) {
        loading.dismiss();
        this.closeModal();
        // console.clear();
      }
    });
  }

getAddressfromLatLong(lat,long)
{
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();
  // 17.6188647 ,121.72674359999999
  const latlng = {
    lat: lat,
    lng: long,
  };
  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        infowindow.setContent(results[0].formatted_address);
        var infoAddress = results[0].formatted_address;
        console.log(infoAddress, 'this log is from coor.resp.lat and long');
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });

}


}
