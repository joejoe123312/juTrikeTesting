import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DropOfLocationPage } from './drop-of-location.page';

describe('DropOfLocationPage', () => {
  let component: DropOfLocationPage;
  let fixture: ComponentFixture<DropOfLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropOfLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DropOfLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
