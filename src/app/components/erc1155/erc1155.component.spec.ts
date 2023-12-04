import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc1155Component } from './erc1155.component';

describe('Erc1155Component', () => {
  let component: Erc1155Component;
  let fixture: ComponentFixture<Erc1155Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Erc1155Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Erc1155Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
