import { TestBed } from '@angular/core/testing';

import { CurrentContractService } from './current-contract.service';

describe('CurrentContractService', () => {
  let service: CurrentContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
