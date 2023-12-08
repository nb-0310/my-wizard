import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseContractComponent } from './use-contract.component';

describe('UseContractComponent', () => {
  let component: UseContractComponent;
  let fixture: ComponentFixture<UseContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseContractComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UseContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
