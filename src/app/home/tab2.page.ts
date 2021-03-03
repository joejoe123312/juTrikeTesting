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
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    const geocoder = new google.maps.Geocoder();
   }
// tslint:disable-next-line: use-lifecycle-interface
  //LOAD THE MAP ONINIT.
  ngOnInit() {
    this.loadMap();    
  }

  //LOADING THE MAP HAS 2 PARTS.
  loadMap() {
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
      latLng = new google.maps.Map(document.getElementById('map'), mapOptions);

      //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude); 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
      this.map.addListener('tilesloaded', () => {
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
      }); 
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
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      }); 
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords(){
    alert('lat' +this.lat+', long'+this.long )
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
    
    let latitude = null;
    let longitude = null;
    geocoder.geocode( { 'address': address}, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
          const lat = results[0].geometry.location.lat();
          const long = results[0].geometry.location.lng();
          
          // CHange the pointer
          // Dito yung taas
          let latLng = new google.maps.LatLng(lat, long);
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
            latLng = new google.maps.Map(document.getElementById('map'), mapOptions);
        }
        
    });
    
    await this.convertAddressToLatLong(address);

    // update maps service so you can use the data in other pages
    
    this.mapsService.updatePickUpLocation(this.latitude, this.longitude, this.pickUpLocation);
    console.log(this.latitude, this.longitude, this.pickUpLocation);

    console.log(this.mapsService.getPickUpLocation());

    

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




  