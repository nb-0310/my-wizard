import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SignService } from './sign.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public router: Router, public signService: SignService) {}

  canActivate(): boolean {
    if (this.signService.signer) return true
    else {
      this.router.navigateByUrl('/')
      return false
    }
  }
}
