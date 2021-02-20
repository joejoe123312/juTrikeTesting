import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-qrcode',
  templateUrl: './view-qrcode.page.html',
  styleUrls: ['./view-qrcode.page.scss'],
})
export class ViewQRCodePage implements OnInit {
  qrData:string = "Hello world Hello Joel John Centeno this is just a testing but this can be changed accordingly";
  constructor() { }

  ngOnInit() {
  }

}
