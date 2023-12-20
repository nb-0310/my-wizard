import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-nav',
  templateUrl: './item-nav.component.html',
  styleUrl: './item-nav.component.css',
})
export class ItemNavComponent {
  activeLink: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.url.subscribe((segments) => {
      const lastSegment = segments[segments.length - 1];
      this.activeLink = lastSegment.path;
    });
  }
}
