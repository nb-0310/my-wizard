import { Component } from '@angular/core';
import { ethers, BigNumber } from 'ethers';
import { CurrentContractService } from '../../services/current-contract.service';
import { SignService } from '../../services/sign.service';
import { Erc20RewardService } from '../../services/erc20-reward.service';
import { ClipboardService } from 'ngx-clipboard';

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
    public signService: SignService,
    public erc20RewardService: Erc20RewardService,
    public clipboardService: ClipboardService
  ) {}

  copyToClipboard(addr: any): void {
    this.clipboardService.copyFromContent(addr);
  }

  ngOnInit(): void {
    this.contractAddress = this.currentContractService.currentContractAddress;
    console.log(this.currentContractService.abi)
  }

  getContract(): void {
    this.contract = new ethers.Contract(
      this.contractAddress,
      this.currentContractService.abi,
      this.provider
    );
  }

  async executeFunction(func: any) {
    const args = func.inputs.map((input: any) => input.value);
    let result;
    try {
        result =
            func.stateMutability === 'view'
                ? await this.contract.callStatic[func.name](...args)
                : await this.contract
                    .connect(this.signService.signer)
                    [func.name](...args);

        console.log(`Function '${func.name}' executed with arguments:`, args);

        if (func.stateMutability === 'view') {
            if (result instanceof BigNumber) {
                this.functionResults[func.name] = ethers.utils.formatEther(result);
            } else {
                this.functionResults[func.name] = result.toString();
            }
        }
    } catch (error: any) {
        console.error(`Error executing function '${func.name}':`, error.message);
    }

    console.log('Result:', result);
    console.log(typeof result);
}
}
