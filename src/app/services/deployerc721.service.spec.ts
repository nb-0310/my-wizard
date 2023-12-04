import { TestBed } from '@angular/core/testing';

import { Deployerc721Service } from './deployerc721.service';

describe('Deployerc721Service', () => {
  let service: Deployerc721Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deployerc721Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
