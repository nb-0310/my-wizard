import { TestBed } from '@angular/core/testing';

import { DeploygtService } from './deploygt.service';

describe('DeploygtService', () => {
  let service: DeploygtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeploygtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
