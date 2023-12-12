import { Component } from '@angular/core';
import { governor } from '@openzeppelin/wizard';
import { GovernorOptions } from '@openzeppelin/wizard/dist/governor';
import { DeploygovernorService } from '../../services/deploygovernor.service';
import { Router } from '@angular/router';
import { Erc20RewardService } from '../../services/erc20-reward.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-governor',
  templateUrl: './governor.component.html',
  styleUrl: './governor.component.css',
})
export class GovernorComponent {
  contractAddress: string = '';
  contract: string = '';
  contractParams: GovernorOptions = {
    name: 'MyGovernor',
    delay: '0 days',
    period: '1 week',
    timelock: false,
  };
  tokenAddr: string = '';

  constructor(
    public deploygovernorService: DeploygovernorService,
    public router: Router,
    public erc20RewardService: Erc20RewardService,
    public clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.generateContract();
  }

  copyToClipboard(): void {
    this.clipboardService.copyFromContent(this.contract);
  }

  generateContract() {
    if (this.contractParams.blockTime)
      this.contractParams.blockTime = Number(this.contractParams.blockTime);

    if (this.contractParams.quorumPercent)
      this.contractParams.quorumPercent = Number(
        this.contractParams.quorumPercent
      );

    const contract = governor.print(this.contractParams);
    this.contract = contract;
  }

  async deploy() {
    const params = {
      name: this.contractParams.name,
      contract: this.contract,
    };
    const res = await this.deploygovernorService.deployGovernor(
      params,
      this.tokenAddr
    );

    this.contractAddress = res;

    this.erc20RewardService.gt = false

    this.router.navigateByUrl('/use-contract');
  }
}
