import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IcoServiceService } from '../../services/ico-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor (public router: Router, public icoService: IcoServiceService) { }

  ngOnInit(): void {
    this.icoService.toIco = false
  }

  navigateToScaas() {
    this.router.navigateByUrl('/main')
  }

  navigateToIco() {
    this.router.navigateByUrl('/ico-prompt')
  }
}
