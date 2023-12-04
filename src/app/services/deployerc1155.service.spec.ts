import { TestBed } from '@angular/core/testing';

import { Deployerc1155Service } from './deployerc1155.service';

describe('Deployerc1155Service', () => {
  let service: Deployerc1155Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deployerc1155Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
