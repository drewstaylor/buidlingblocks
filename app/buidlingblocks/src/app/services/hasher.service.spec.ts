import { TestBed, inject } from '@angular/core/testing';

import { HasherService } from './hasher.service';

describe('HasherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HasherService]
    });
  });

  it('should be created', inject([HasherService], (service: HasherService) => {
    expect(service).toBeTruthy();
  }));
});
