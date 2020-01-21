/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MobileService } from './mobile.service';

describe('Service: Mobile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobileService]
    });
  });

  it('should ...', inject([MobileService], (service: MobileService) => {
    expect(service).toBeTruthy();
  }));
});
