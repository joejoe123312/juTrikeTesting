import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanQrcodePage } from './scan-qrcode.page';

describe('ScanQrcodePage', () => {
  let component: ScanQrcodePage;
  let fixture: ComponentFixture<ScanQrcodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanQrcodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanQrcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
