import { Component } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  signer: any;
  address: string = '';
  showLoader: boolean = false

  constructor(
    public signService: SignService,
    public router: Router,
    public clipboardService: ClipboardService
  ) {}

  copyToClipboard(): void {
    if (this.address) {
      this.clipboardService.copyFromContent(this.address);
    }
  }

  async getSigner() {
    this.showLoader = true
    this.signer = await this.signService.getSigner();
    this.showLoader = false
    this.router.navigateByUrl('/home');
    this.address = await this.signer.getAddress();
    return this.signer;
  }
}
