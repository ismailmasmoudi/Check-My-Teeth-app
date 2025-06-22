import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToothSelectorComponent } from './tooth-selector.component';

describe('ToothSelectorComponent', () => {
  let component: ToothSelectorComponent;
  let fixture: ComponentFixture<ToothSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToothSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToothSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
