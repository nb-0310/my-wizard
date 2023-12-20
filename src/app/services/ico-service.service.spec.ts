import { TestBed } from '@angular/core/testing';

import { IcoServiceService } from './ico-service.service';

describe('IcoServiceService', () => {
  let service: IcoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
