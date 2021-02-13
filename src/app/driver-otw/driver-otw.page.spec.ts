import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DriverOtwPage } from './driver-otw.page';

describe('DriverOtwPage', () => {
  let component: DriverOtwPage;
  let fixture: ComponentFixture<DriverOtwPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverOtwPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DriverOtwPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
