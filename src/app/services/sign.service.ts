import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from '../../environments/environment';

interface CustomWindow extends Window {
  ethereum?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SignService {
  signer: any;

  constructor() {}

  async connectToWeb3(): Promise<void> {
    try {
      // const customWindow = window as CustomWindow;

      const provider = new ethers.providers.JsonRpcProvider(environment.RpcUrl);
      console.log('Provder rpc', provider);
      this.signer = new ethers.Wallet(environment.privateKey, provider);
      console.log('Signer Rpc', this.signer);

      // This will be used in production

      // if (customWindow.ethereum) {
      //   const accounts = await customWindow.ethereum.request({
      //     method: 'eth_requestAccounts',
      //   });

      //   const provider = new ethers.providers.Web3Provider(
      //     customWindow.ethereum
      //   );
      //   await provider.send('eth_requestAccounts', []);
      //   this.signer = provider.getSigner();
      // } else {
      //   console.error('Ethereum provider not detected');
      // }
    } catch (error) {
      console.error('Error connecting to Ethereum provider:', error);
    }
  }

  async getSigner() {
    await this.connectToWeb3();
    return this.signer;
  }
}
