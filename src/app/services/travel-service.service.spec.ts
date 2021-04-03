import { TestBed } from '@angular/core/testing';

import { TravelServiceService } from './travel-service.service';

describe('TravelServiceService', () => {
  let service: TravelServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
