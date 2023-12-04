import { TestBed } from '@angular/core/testing';

import { Deployerc20Service } from './deployerc20.service';

describe('Deployerc20Service', () => {
  let service: Deployerc20Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deployerc20Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
