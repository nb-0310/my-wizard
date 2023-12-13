import { Component } from '@angular/core';
import { erc20 } from '@openzeppelin/wizard';
import { ERC20Options } from '@openzeppelin/wizard/dist/erc20';
import { ClipboardService } from 'ngx-clipboard';
import { Router } from '@angular/router';
import { Erc20RewardService } from '../../services/erc20-reward.service';
import { DeployService } from '../../services/deploy.service';

@Component({
  selector: 'app-erc20',
  templateUrl: './erc20.component.html',
  styleUrl: './erc20.component.css',
})
export class Erc20Component {
  contract: string = '';
  staking: boolean = false;
  minStakingDuration: string = '2 days';
  rewardMultiplier: number = 5;
  rewards: boolean = false;
  votingThreshold: number = 10;
  showLoader: boolean = false

  contractParams: ERC20Options = {
    name: 'ExampleToken',
    symbol: 'ETK',
  };

  contractAddress: string = '';

  constructor(
    private clipboardService: ClipboardService,
    public router: Router,
    public erc20RewardService: Erc20RewardService,
    public deployService: DeployService
  ) {}

  copyToClipboard(): void {
    this.clipboardService.copyFromContent(this.contract);
  }

  ngOnInit(): void {
    this.generateContract();
  }

  generateTransferFunction(): string {
    return this.rewards ? 
    `
    function transferFrom(address from, address to, uint256 amount) public override returns(bool) {
      approve(from, amount);
      _transfer(from, to, amount);

      return true;
    }
    
    function transfer(address to, uint256 amount) public override returns(bool) {
      _transfer(msg.sender, to, amount);
      return true;
    }`
    : 
    `
    function transfer(address to, uint256 amount) public override returns(bool) {
      _transfer(msg.sender, to, amount);
      return true;
    }`;
  }

  generateContract(): string {
    const contract: string = erc20.print(this.contractParams as ERC20Options);

    const lastCurlyBraceIndex: number = contract.lastIndexOf('}');

    const modifiedContract: string =
      contract.slice(0, lastCurlyBraceIndex) +
      this.generateTransferFunction() +
      '\n' +
      contract.slice(lastCurlyBraceIndex);

    const finalContract: string = modifiedContract.replace(
      '/// @custom:oz-upgrades-unsafe-allow constructor',
      ''
    );

    this.contract = finalContract;
    return finalContract;
  }

  async deploy() {
    this.showLoader = true
    this.deployService.contractParams = this.contractParams
    this.deployService.contractType = 'erc20'
    const res = await this.deployService.deploy({
      name: this.contractParams.name,
      symbol: this.contractParams.symbol,
      contract: this.contract,
    });

    this.contractAddress = res;

    this.erc20RewardService.gt = false

    this.showLoader = false

    this.router.navigateByUrl('/use-contract');
  }

  goToHome() {
    this.router.navigateByUrl('/main');
  }
}
