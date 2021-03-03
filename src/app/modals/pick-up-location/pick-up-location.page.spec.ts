import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickUpLocationPage } from './pick-up-location.page';

describe('PickUpLocationPage', () => {
  let component: PickUpLocationPage;
  let fixture: ComponentFixture<PickUpLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickUpLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickUpLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
