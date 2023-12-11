import { Injectable } from '@angular/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { SignService } from './sign.service';
import { CurrentContractService } from './current-contract.service';

@Injectable({
  providedIn: 'root',
})
export class DeploygtService {
  private apiUrl = 'http://localhost:5000/create-gt-contract';
  contractParams: any;

  constructor(public signService: SignService, public currentContractService: CurrentContractService) {}

  async getAbi(params: any): Promise<{ abi: string; bytecode: string }> {
    try {
      const response = await axios.post(this.apiUrl, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const abi = response.data.abi;
      const bytecode = response.data.bytecode;
      return { abi, bytecode };
    } catch (error) {
      throw error;
    }
  }

  async deployERC721(params: any): Promise<any> {
    const res = await this.getAbi(params);

    const abi = res.abi;
    const bytecode = res.bytecode;

    const signer = await this.signService.getSigner();

    if (abi && bytecode) {
      const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

      let contract;
      let addr = await signer.getAddress();

      if (
        this.contractParams.access ||
        this.contractParams.mintable ||
        this.contractParams.pausable
      ) {
        contract = await contractFactory.deploy(addr);
      } else {
        contract = await contractFactory.deploy();
      }

      await contract.deployed();

      console.log(abi)

      const contractAddress = contract.address;
      console.log('Contract deployed to address:', contractAddress);

      this.currentContractService.setAddress(contractAddress);
      this.currentContractService.abi = abi

      return contractAddress;
    }
  }
}
