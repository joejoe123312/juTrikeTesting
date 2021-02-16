import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewQRCodePage } from './view-qrcode.page';

describe('ViewQRCodePage', () => {
  let component: ViewQRCodePage;
  let fixture: ComponentFixture<ViewQRCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQRCodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewQRCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
