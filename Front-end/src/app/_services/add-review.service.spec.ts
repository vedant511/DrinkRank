import { TestBed, inject } from '@angular/core/testing';

import { AddReviewService } from './add-review.service';

describe('AddReviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddReviewService]
    });
  });

  it('should be created', inject([AddReviewService], (service: AddReviewService) => {
    expect(service).toBeTruthy();
  }));
});
