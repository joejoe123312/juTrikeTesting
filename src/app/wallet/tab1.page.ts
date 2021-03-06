import { Component } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  data: any;
  constructor(private barcodeScanner: BarcodeScanner) {}

  scanQr(){
      this.data = null;
      this.barcodeScanner.scan().then(barcodeData => {
        
        this.data = barcodeData;
        
      }).catch(err => {
        console.log('Error', err);
      });
  }

}
