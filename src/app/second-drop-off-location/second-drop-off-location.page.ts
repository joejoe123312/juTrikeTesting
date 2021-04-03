import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import { NgZone } from '@angular/core';
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

declare var google: any;

@Component({
  selector: 'app-second-drop-off-location',
  templateUrl: './second-drop-off-location.page.html',
  styleUrls: ['./second-drop-off-location.page.scss'],
})
export class SecondDropOffLocationPage implements OnInit {

  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  modalTitle: string;
  modelId: number;
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
  )
  {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    const geocoder = new google.maps.Geocoder();
  }

  ngOnInit() {

  }

  async closeModal() {

    await this.modalController.dismiss();
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

      await this.mapsService.updateSecondDropOffLocation(this.latitude, this.longitude, this.pickUpLocation);
      // console.log(this.latitude, this.longitude, this.pickUpLocation);


      this.closeModal();



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
}
