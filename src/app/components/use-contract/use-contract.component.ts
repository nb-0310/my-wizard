import { Component, Input } from '@angular/core';
import { ethers, providers } from 'ethers';
import { CurrentContractService } from '../../services/current-contract.service';
import { SignService } from '../../services/sign.service';

@Component({
  selector: 'app-use-contract',
  templateUrl: './use-contract.component.html',
  styleUrl: './use-contract.component.css',
})
export class UseContractComponent {
  contractAddress: string = '';
  contractAbi: Array<object> = [];
  providerString: string = '';
  contract: any;
  provider: any = new ethers.providers.JsonRpcProvider(
    'https://goerli.infura.io/v3/040153c0048b43b190d3ee87e7ede59b'
  );

  functionResults: { [key: string]: any } = {};

  constructor(
    public currentContractService: CurrentContractService,
    public signService: SignService
  ) {}

  ngOnInit(): void {
    this.contractAddress = this.currentContractService.currentContractAddress;
  }

  getContract(): void {
    this.contract = new ethers.Contract(
      this.contractAddress,
      this.currentContractService.abi,
      this.provider
    );

    if (this.contract.transfer) console.log(this.contract)
    else console.log('Noo:(')
  }

  async executeFunction(func: any) {
    const args = func.inputs.map((input: any) => input.value);

    try {
      // Execute the function based on stateMutability
      const result =
        func.stateMutability === 'view'
          ? await this.contract.callStatic[func.name](...args)
          : await this.contract.connect(this.signService.signer)[func.name](...args);

      console.log(`Function '${func.name}' executed with arguments:`, args);

      // Display the result only if it's not an object and for view functions
      if (func.stateMutability === 'view') {
        console.log('Result:', result);

        // Store the result associated with the function name
        this.functionResults[func.name] = result;
      }
    } catch (error: any) {
      console.error(`Error executing function '${func.name}':`, error.message);
    }
  }
}