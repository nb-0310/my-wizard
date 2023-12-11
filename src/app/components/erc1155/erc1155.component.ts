import { Component } from '@angular/core';
import { erc1155 } from '@openzeppelin/wizard';
import { ERC1155Options } from '@openzeppelin/wizard/dist/erc1155';
import { ClipboardService } from 'ngx-clipboard';
import { Deployerc1155Service } from '../../services/deployerc1155.service';
import { Router } from '@angular/router';
import { Erc20RewardService } from '../../services/erc20-reward.service';

@Component({
  selector: 'app-erc1155',
  templateUrl: './erc1155.component.html',
  styleUrl: './erc1155.component.css',
})
export class Erc1155Component {
  contract: string = '';
  staking: boolean = false;
  minStakingDuration: string = '2 days';
  rewardMultiplier: number = 5; // Default reward multiplier
  rewards: boolean = false;
  votingThreshold: number = 10;

  contractParams: ERC1155Options = {
    name: 'ExampleToken',
    uri: 'https://emerald-glad-squid-977.mypinata.cloud/ipfs/QmP2HEzR4WtyhXHF5otzmi63HwnEsJM4ftWSApF6MEFBiq"',
  };

  contractAddress: string = '';

  constructor(
    private clipboardService: ClipboardService,
    public deployerc1155Service: Deployerc1155Service,
    public router: Router,
    public erc20RewardService: Erc20RewardService
  ) {}

  copyToClipboard(): void {
    this.clipboardService.copyFromContent(this.contract);
  }

  ngOnInit(): void {
    this.generateContract();
  }

  generateTransferFunction(): string {
    return `
    function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes memory data) public override {
      safeTransferFrom(from, to, id, value, data);
    }`;
  }

  generateContract(): string {
    const contract: string = erc1155.print(
      this.contractParams as ERC1155Options
    );

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
    this.deployerc1155Service.contractParams = this.contractParams
    const params = {
      name: this.contractParams.name,
      uri: this.contractParams.uri,
      contract: this.contract
    }
    const res = await this.deployerc1155Service.deployERC721(
      params
    );

    this.contractAddress = res;

    this.erc20RewardService.gt = false

    this.router.navigateByUrl('/use-contract')
  }

  goToHome() {
    this.router.navigateByUrl('/main');
  }
}
