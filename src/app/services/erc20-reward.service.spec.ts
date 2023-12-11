import { TestBed } from '@angular/core/testing';

import { Erc20RewardService } from './erc20-reward.service';

describe('Erc20RewardService', () => {
  let service: Erc20RewardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Erc20RewardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
