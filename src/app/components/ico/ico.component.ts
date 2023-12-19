import { Component } from '@angular/core';
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
    public deployService: DeployService
  ) {}

  async ngOnInit(): Promise<void> {
    const tokenAddress = localStorage.getItem('contractAddress');
    this.tokenAddress = tokenAddress as string;
    this.tokenOwnerAddress = await this.signService.signer.getAddress();
  }

  addSalePhase() {
    this.salePhases.push({
      startTime: '',
      endTime: '',
      discountRate: 0,
    });
  }

  logPhases() {
    console.log(this.salePhases);
    console.log(abi);
  }

  copyToClipboard(): void {
    this.clipboardService.copyFromContent(this.contract);
  }

  async deploy(): Promise<any> {
    // this.showLoader = true
    // this.deployService.contractParams = this.contractParams
    // this.deployService.contractType = 'erc20'
    const params = {
      tokenAddress: this.tokenAddress,
      tokenOwnerAddress: this.tokenOwnerAddress,
      tokenPrice: this.tokenPrice,
    };

    const res = await this.deployService.deployIco(abi, bytecode, params);

    console.log(res)

    // this.contractAddress = res;
    // this.erc20RewardService.gt = false;
    // localStorage.setItem('contractAddress', res);
    // this.showLoader = false;
    // this.router.navigateByUrl('/use-contract');
  }
}
