import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernorComponent } from './governor.component';

describe('GovernorComponent', () => {
  let component: GovernorComponent;
  let fixture: ComponentFixture<GovernorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GovernorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GovernorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
