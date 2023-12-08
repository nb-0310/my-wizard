import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentContractService {
  currentContractAddress: string = ''
  abi: any

  constructor() { 
    console.log(this.abi)
   }

  getAddress(): string {
    return this.currentContractAddress
  }

  setAddress(addr: string): void {
    this.currentContractAddress = addr
  }

  getAbi() {
    return this.abi
  }

  setAbi(newAbi: any) {
    this.abi = newAbi
  }
}
