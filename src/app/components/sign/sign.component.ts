import { Component } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.css'
})
export class SignComponent {
  constructor(public signService: SignService, public router: Router) {}

  ngOnInit(): void {
    if (this.signService.signer) {
      this.router.navigateByUrl('/home')
    }
  }

  async getSigner() {
    const signer = await this.signService.getSigner()
    console.log(await signer.getAddress())
  }
}
