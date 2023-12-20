import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { contract } from '../../constants';
import abi from '../../abi.json';
import { bytecode } from '../../constants';
import { SignService } from '../../services/sign.service';
import { DeployService } from '../../services/deploy.service';

@Component({
  selector: 'app-ico',
  templateUrl: './ico.component.html',
  styleUrl: './ico.component.css',
})
export class IcoComponent {
  contract: string = contract;
  tokenAddress: string = '';
  tokenPrice: string = '';
  tokenOwnerAddress: string = '';
  salePhases: { startTime: string; endTime: string; discountRate: number }[] =
    [];

  constructor(
    private clipboardService: ClipboardService,
    public signService: SignService,
    public deployService: DeployService,
    public router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const tokenAddress = localStorage.getItem('contractAddress');
    this.tokenAddress = tokenAddress as string;
    this.tokenOwnerAddress = await this.signService.signer.getAddress();
    console.log(this.tokenOwnerAddress);
  }

  addSalePhase() {
    this.salePhases.push({
      startTime: '',
      endTime: '',
      discountRate: 0,
    });
  }

  logPhases() {
    console.log("Sale Phases: ");
    console.log(this.salePhases)
    console.log(abi);
    const dt: any = new Date();
    console.log('Current timestamp:', Math.floor(dt / 1000));
  }

  copyToClipboard(): void {
    this.clipboardService.copyFromContent(this.contract);
  }

  async deploy(): Promise<any> {
    this.logPhases();
    this.deployService.contractType = 'ico';

    const startTimes: Array<any> = [];
    const endTimes: Array<any> = [];
    const discounts: Array<any> = [];

    for (let i = 0; i < this.salePhases.length; i++) {
      const start: any = new Date(this.salePhases[i].startTime);
      startTimes.push(Math.floor(start / 1000));
      // startTimes.push(start);

      const end: any = new Date(this.salePhases[i].endTime);
      endTimes.push(Math.floor(end / 1000));
      // endTimes.push(end);

      discounts.push(this.salePhases[i].discountRate);
    }

    const params = {
      tokenAddress: this.tokenAddress,
      tokenOwnerAddress: this.tokenOwnerAddress,
      tokenPrice: this.tokenPrice,
      startTimes,
      endTimes,
      discounts,
    };

    console.log(params);

    const res = await this.deployService.deployIco(abi, bytecode, params);

    // console.log(res);

    // this.contractAddress = res;
    // this.erc20RewardService.gt = false;
    // localStorage.setItem('contractAddress', res);
    // this.showLoader = false;
    this.router.navigateByUrl('/use-contract');
  }
}
