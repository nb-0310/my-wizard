import { Component } from '@angular/core';
import { erc20 } from '@openzeppelin/wizard';
import { ERC20Options } from '@openzeppelin/wizard/dist/erc20';
import { ClipboardService } from 'ngx-clipboard';
import { Deployerc20Service } from '../../services/deployerc20.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-erc20',
  templateUrl: './erc20.component.html',
  styleUrl: './erc20.component.css',
})
export class Erc20Component {
  contract: string = '';
  staking: boolean = false;
  minStakingDuration: string = '2 days';
  rewardMultiplier: number = 5; // Default reward multiplier
  rewards: boolean = false;
  votingThreshold: number = 10;

  contractParams: ERC20Options = {
    name: 'ExampleToken',
    symbol: 'ETK',
  };

  contractAddress: string = '';

  constructor(
    private clipboardService: ClipboardService,
    public deployerc20Service: Deployerc20Service,
    public router: Router
  ) {}

  copyToClipboard(): void {
    this.clipboardService.copyFromContent(this.contract);
  }

  ngOnInit(): void {
    this.generateContract();
  }

  generateTransferFunction(): string {
    return `
    function transfer(address to, uint256 amount) public override returns(bool) {
      _transfer(msg.sender, to, amount);
      return true;
    }`;
  }

  generateContract(): string {
    console.log(this.contractParams)
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
    this.deployerc20Service.contractParams = this.contractParams
    const params = {
      name: this.contractParams.name,
      symbol: this.contractParams.symbol,
      contract: this.contract
    }

    const res = await this.deployerc20Service.deployERC721(params);
    this.contractAddress = res;
    this.router.navigateByUrl('/use-contract');
  }

  goToHome() {
    this.router.navigateByUrl('/main');
  }
}
