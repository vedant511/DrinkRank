import { TestBed, inject } from '@angular/core/testing';

import { MfrService } from './mfr.service';

describe('MfrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MfrService]
    });
  });

  it('should be created', inject([MfrService], (service: MfrService) => {
    expect(service).toBeTruthy();
  }));
});
