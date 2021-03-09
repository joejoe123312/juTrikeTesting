import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestingPagePage } from './testing-page.page';

describe('TestingPagePage', () => {
  let component: TestingPagePage;
  let fixture: ComponentFixture<TestingPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestingPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
