
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { MapsService } from '../services/maps.service';
declare var google: any;

@Component({
  selector: 'app-testing-page',
  templateUrl: './testing-page.page.html',
  styleUrls: ['./testing-page.page.scss'],
})

export class TestingPagePage implements OnInit {

  constructor(
    private mapsService: MapsService,
  ) { }

  ngOnInit() {
    // var startLat = 17.618845;
    // var startLng = 121.7267278;
    // var endLat = 17.629654;
    // var endLng = 121.7334073;
    // let lat = 17.618829599999998;
    // let long = 121.7267303;
    // this.mapsService.getAddressfromLatLong(lat, long).subscribe(observedValue => {
    //   console.log(typeof(observedValue));
    // });
  }
  SinglePassenger()
  {

  }

}
