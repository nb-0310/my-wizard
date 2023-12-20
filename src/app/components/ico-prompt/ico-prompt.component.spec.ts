import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcoPromptComponent } from './ico-prompt.component';

describe('IcoPromptComponent', () => {
  let component: IcoPromptComponent;
  let fixture: ComponentFixture<IcoPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IcoPromptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IcoPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
