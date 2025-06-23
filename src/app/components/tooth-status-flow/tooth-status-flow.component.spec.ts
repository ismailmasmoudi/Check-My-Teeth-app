import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToothStatusFlowComponent } from './tooth-status-flow.component';

describe('ToothStatusFlowComponent', () => {
  let component: ToothStatusFlowComponent;
  let fixture: ComponentFixture<ToothStatusFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToothStatusFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToothStatusFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
