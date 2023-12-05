import { TestBed } from '@angular/core/testing';

import { DeploygovernorService } from './deploygovernor.service';

describe('DeploygovernorService', () => {
  let service: DeploygovernorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeploygovernorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
