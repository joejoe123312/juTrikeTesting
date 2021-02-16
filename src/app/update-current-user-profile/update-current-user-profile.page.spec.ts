import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateCurrentUserProfilePage } from './update-current-user-profile.page';

describe('UpdateCurrentUserProfilePage', () => {
  let component: UpdateCurrentUserProfilePage;
  let fixture: ComponentFixture<UpdateCurrentUserProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCurrentUserProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCurrentUserProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
