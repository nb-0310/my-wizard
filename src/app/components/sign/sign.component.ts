import { Component } from '@angular/core';
import { SignService } from '../../services/sign.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.css'
})
export class SignComponent {
  constructor(public signService: SignService) {}
}
