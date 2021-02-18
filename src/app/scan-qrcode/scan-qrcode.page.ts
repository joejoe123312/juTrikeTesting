import { Component, OnInit } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-scan-qrcode',
  templateUrl: './scan-qrcode.page.html',
  styleUrls: ['./scan-qrcode.page.scss'],
})
export class ScanQrcodePage implements OnInit {
   data: any;
  constructor(private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
    this.data = null;
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.data = barcodeData;
    }).catch(err => {
      console.log('Error', err);
    });
  }

}
