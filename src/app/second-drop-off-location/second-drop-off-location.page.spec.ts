import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SecondDropOffLocationPage } from './second-drop-off-location.page';

describe('SecondDropOffLocationPage', () => {
  let component: SecondDropOffLocationPage;
  let fixture: ComponentFixture<SecondDropOffLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondDropOffLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SecondDropOffLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
