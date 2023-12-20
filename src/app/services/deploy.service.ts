import { Injectable } from '@angular/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { SignService } from './sign.service';
import { CurrentContractService } from './current-contract.service';

@Injectable({
  providedIn: 'root',
})
export class DeployService {
  contractParams: any;
  contractType: string = 'gt';

  constructor(
    public signService: SignService,
    public currentContractService: CurrentContractService
  ) {}

  async getAbi(params: any): Promise<{ abi: string; bytecode: string }> {
    const apiUrl = `http://localhost:5000/create-${this.contractType}-contract`;
    try {
      const response = await axios.post(apiUrl, params, {
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

  async deploy(params: any): Promise<any> {
    const res = await this.getAbi(params);

    const abi = res.abi;
    const bytecode = res.bytecode;

    const signer = await this.signService.getSigner();

    if (abi && bytecode) {
      const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

      let contract;
      let addr = await signer.getAddress();

      if (
        this.contractParams.access === 'roles' &&
        this.contractParams.mintable &&
        this.contractParams.pausable
      ) {
        contract = await contractFactory.deploy(addr, addr, addr);
      } else if (
        (this.contractParams.access === 'roles' &&
          this.contractParams.mintable &&
          !this.contractParams.pausable) ||
        (this.contractParams.access === 'roles' &&
          this.contractParams.pausable &&
          !this.contractParams.mintable)
      ) {
        contract = await contractFactory.deploy(addr, addr);
      } else if (
        this.contractParams.access ||
        this.contractParams.mintable ||
        this.contractParams.pausable
      ) {
        contract = await contractFactory.deploy(addr);
      } else {
        contract = await contractFactory.deploy();
      }

      await contract.deployed();

      const contractAddress = contract.address;
      console.log('Contract deployed to address:', contractAddress);

      this.currentContractService.setAddress(contractAddress);
      this.currentContractService.abi = abi;

      return contractAddress;
    }
  }

  async deployGovernor(params: any, tokenAddr: string): Promise<any> {
    const res = await this.getAbi(params);

    const abi = res.abi;
    const bytecode = res.bytecode;

    const signer = await this.signService.getSigner();

    if (abi && bytecode) {
      const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

      const contract = await contractFactory.deploy(tokenAddr);

      await contract.deployed();

      const contractAddress = contract.address;
      console.log('Contract deployed to address:', contractAddress);

      this.currentContractService.setAddress(contractAddress);
      this.currentContractService.abi = abi;

      return contractAddress;
    }
  }

  async deployIco(abi: any, bytecode: string, params: any): Promise<any> {
    if (abi && bytecode) {
      const contractFactory = new ethers.ContractFactory(
        abi,
        bytecode,
        this.signService.signer
      );

      const contract = await contractFactory.deploy(
        params.tokenAddress,
        params.startTimes,
        params.endTimes,
        params.discounts,
        params.tokenPrice,
        params.tokenOwnerAddress,
        params.tokenOwnerAddress
      );

      await contract.deployed();

      const contractAddress = contract.address;
      console.log('Contract deployed to address:', contractAddress);

      this.currentContractService.setAddress(contractAddress);
      this.currentContractService.abi = abi;

      return contractAddress;
    }
  }
}
