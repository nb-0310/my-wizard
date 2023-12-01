import { Component } from '@angular/core';
import { erc20 } from '@openzeppelin/wizard';
import { ERC20Options } from '@openzeppelin/wizard/dist/erc20';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  contract: string = '';

  contractParams: ERC20Options = {
    name: 'ExampleToken',
    symbol: 'ETK',
  };

  constructor() {}

  ngOnInit(): void {
    this.generateContract();
  }

  generateTransferFunction(): string {
    return `
      function transfer(address to, uint256 amount) public {
          _transfer(msg.sender, to, amount);
      }`;
  }

  generateContract(): string {
    const contract: string = erc20.print(this.contractParams);

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
    console.log(this.contract);
    return finalContract;
  }
}
