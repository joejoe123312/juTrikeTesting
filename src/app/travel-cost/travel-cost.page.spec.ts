import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TravelCostPage } from './travel-cost.page';

describe('TravelCostPage', () => {
  let component: TravelCostPage;
  let fixture: ComponentFixture<TravelCostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelCostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TravelCostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
