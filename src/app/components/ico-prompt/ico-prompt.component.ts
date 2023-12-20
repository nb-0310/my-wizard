import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { IcoServiceService } from '../../services/ico-service.service';

@Component({
  selector: 'app-ico-prompt',
  templateUrl: './ico-prompt.component.html',
  styleUrl: './ico-prompt.component.css',
})
export class IcoPromptComponent {
  whereToTake: any;
  tokenAddress: string = '';
  error: string = '';

  constructor(public router: Router, public icoService: IcoServiceService) {}

  onSubmit() {
    if (this.whereToTake === 'ico') {
      if (!this.isValidEthereumAddress(this.tokenAddress)) {
        this.error = 'Invalid Ethereum address';
        return;
      }

      localStorage.setItem('contractAddress', this.tokenAddress);
    }

    if (this.whereToTake === 'ico') {
      this.router.navigate(['/ico']);
    } else {
      this.icoService.toIco = true
      this.router.navigate(['/erc20']);
    }
  }

  private isValidEthereumAddress(address: string): boolean {
    return ethers.utils.isAddress(address);
  }

  handleChange() {
    this.tokenAddress = '';
    this.error = '';
    console.log(this.whereToTake);
  }
}
