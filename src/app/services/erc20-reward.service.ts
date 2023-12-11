import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Erc20RewardService {
  erc20ContractAddress: string | null = null
  gt: boolean = false

  constructor() { }
}
