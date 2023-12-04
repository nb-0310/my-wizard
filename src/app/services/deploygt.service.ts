import { Injectable } from '@angular/core';
import axios from 'axios';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class DeploygtService {
  private apiUrl = 'http://localhost:3000/create-gt-contract'; // Replace with your actual API endpoint

  constructor() {}

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

    const provider = new ethers.providers.JsonRpcProvider(
      'https://goerli.infura.io/v3/c443bf71cccd48338a6826b337a658ca'
    );

    const signer = new ethers.Wallet(
      '0513d443d9ba9f9db2ef69df02a101e1c1152dd63afdbde3ff8ac4fca0b778f2',
      provider
    );

    if (abi && bytecode) {
      const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);

      const contract = await contractFactory.deploy(
        '0x000e063943E9E8574EF5De947ea00Fb6Ca01B04F'
      );

      await contract.deployed();

      const contractAddress = contract.address;
      console.log('Contract deployed to address:', contractAddress);

      return contractAddress;
    }
  }
}
