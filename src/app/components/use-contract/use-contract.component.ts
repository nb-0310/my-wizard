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
}
