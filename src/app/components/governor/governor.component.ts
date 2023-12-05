import { Component } from '@angular/core';
import { governor } from '@openzeppelin/wizard';
import { GovernorOptions } from '@openzeppelin/wizard/dist/governor';
import { DeploygovernorService } from '../../services/deploygovernor.service';

@Component({
  selector: 'app-governor',
  templateUrl: './governor.component.html',
  styleUrl: './governor.component.css',
})
export class GovernorComponent {
  contractAddress: string = ''
  contract: string = '';
  contractParams: GovernorOptions = {
    name: 'MyGovernor',
    delay: '0 days',
    period: '1 week',
    timelock: false
  };
  tokenAddr: string = ''

  constructor(public deploygovernorService: DeploygovernorService) {}

  ngOnInit(): void {
    this.generateContract();
  }

  generateContract() {
    if (this.contractParams.blockTime)
      this.contractParams.blockTime = Number(this.contractParams.blockTime);

    if (this.contractParams.quorumPercent)
      this.contractParams.quorumPercent = Number(
        this.contractParams.quorumPercent
      );

    console.log(this.contractParams)

    const contract = governor.print(this.contractParams);
    this.contract = contract;
  }

  async deploy() {
    const params = {
      name: this.contractParams.name,
      contract: this.contract
    }
    const res = await this.deploygovernorService.deployGovernor(
      params, this.tokenAddr
    );

    this.contractAddress = res
  }
}
