import { Component } from '@angular/core';
import { erc721 } from '@openzeppelin/wizard';
import { ERC721Options } from '@openzeppelin/wizard/dist/erc721';
import { ClipboardService } from 'ngx-clipboard';
import { Deployerc721Service } from '../../services/deployerc721.service';

@Component({
  selector: 'app-erc721',
  templateUrl: './erc721.component.html',
  styleUrls: ['./erc721.component.css'],
})
export class Erc721Component {
  contract: string = '';
  staking: boolean = false;
  minStakingDuration: string = '2 days';
  rewardMultiplier: number = 5; // Default reward multiplier
  rewards: boolean = false;
  votingThreshold: number = 10;

  contractParams: ERC721Options = {
    name: 'ExampleToken',
    symbol: 'ETK',
  };

  contractAddress: string = ''

  constructor(private clipboardService: ClipboardService, public deployerc721Service: Deployerc721Service) {}

  copyToClipboard(): void {
    this.clipboardService.copyFromContent(this.contract);
  }

  ngOnInit(): void {
    this.generateContract();
  }

  generateTransferFunction(): string {
    return `
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
      _transfer(from, to, tokenId);
    }`
  }

  generateContract(): string {

    const contract: string = erc721.print(this.contractParams as ERC721Options);

    const lastCurlyBraceIndex: number = contract.lastIndexOf("}")

      const modifiedContract: string =
        contract.slice(0, lastCurlyBraceIndex) +
        this.generateTransferFunction() +
        "\n" +
        contract.slice(lastCurlyBraceIndex)
    
      const finalContract: string = modifiedContract.replace(
        "/// @custom:oz-upgrades-unsafe-allow constructor",
        ""
      )

    this.contract = finalContract;
    return finalContract;
  }

  async deploy () {
    const res = await this.deployerc721Service.deployERC721(this.contractParams)
    
    this.contractAddress = res
  }
}
