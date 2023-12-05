import { Component } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  signer: any;

  constructor(public signService: SignService, public router: Router) {}

  async getSigner() {
    this.signer = await this.signService.getSigner();
    this.router.navigateByUrl('/main');
    return this.signer;
  }
}
