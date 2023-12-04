import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc721Component } from './erc721.component';

describe('Erc721Component', () => {
  let component: Erc721Component;
  let fixture: ComponentFixture<Erc721Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Erc721Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Erc721Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
