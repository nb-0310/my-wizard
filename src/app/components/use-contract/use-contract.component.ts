import { Component } from '@angular/core';
import { ethers, BigNumber } from 'ethers';
import { CurrentContractService } from '../../services/current-contract.service';
import { SignService } from '../../services/sign.service';
import { Erc20RewardService } from '../../services/erc20-reward.service';
import { ClipboardService } from 'ngx-clipboard';

interface CustomWindow extends Window {
  ethereum?: any;
}

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
  showLoader: boolean = false;
  // provider: any = new ethers.providers.JsonRpcProvider(
  //   'https://goerli.infura.io/v3/040153c0048b43b190d3ee87e7ede59b'
  // );
  customWindow = window as CustomWindow
  provider: any = new ethers.providers.Web3Provider(this.customWindow.ethereum)
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
    console.log(this.currentContractService.abi);
  }

  getContract(): void {
    this.contract = new ethers.Contract(
      this.contractAddress,
      this.currentContractService.abi,
      this.provider
    );
  }

  async executeFunction(func: any) {
    this.showLoader = true;
    const args = func.inputs.map((input: any) => input.value);
    let result;

    try {
      if (func.stateMutability === 'view') {
        result = await this.contract.callStatic[func.name](...args);

        console.log(
          `View function '${func.name}' executed with arguments:`,
          args
        );

        if (result instanceof BigNumber) {
          this.functionResults[func.name] = ethers.utils.formatEther(result);
        } else {
          this.functionResults[func.name] = result.toString();
        }
      } else if (func.stateMutability === 'nonpayable') {
        const tx = await this.contract
          .connect(this.signService.signer)
          [func.name](...args);

          await tx.wait()

        this.functionResults[func.name] = 'Transaction successful';
        console.log(
          `Non Payable function '${func.name}' executed with arguments:`,
          args
        );
      } else {
        const currentTokenPrice = await this.contract.callStatic.tokenPrice();
        const currentPhase = await this.contract.callStatic.getCurrentPhase();
        const discountRate = await currentPhase.discountRate;
        const overrides = {
          value:
            func.stateMutability === 'payable'
              ? currentTokenPrice * args[0] * (discountRate / 100)
              : undefined,
          // gasPrice: ethers.utils.parseUnits('30', 'gwei'),
          gasLimit: 200000,
        };

        const tx = await this.contract
          .connect(this.signService.signer)
          [func.name](...args, overrides);

        await tx.wait();

        this.functionResults[func.name] = 'Transaction successful';
        console.log(`Transaction for function '${func.name}' successful.`);
      }
    } catch (error: any) {
      console.error(`Error executing function '${func.name}':`, error.message);
    }

    this.showLoader = false;

    console.log('Result:', result);
    console.log(typeof result);
  }
}