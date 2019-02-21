import { TestBed, inject } from '@angular/core/testing';

import { ChildContractService } from './child-contract.service';

describe('ChildContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChildContractService]
    });
  });

  it('should be created', inject([ChildContractService], (service: ChildContractService) => {
    expect(service).toBeTruthy();
  }));
});
