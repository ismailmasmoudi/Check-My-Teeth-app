import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainTypeSelectorComponent } from './pain-type-selector.component';

describe('PainTypeSelectorComponent', () => {
  let component: PainTypeSelectorComponent;
  let fixture: ComponentFixture<PainTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainTypeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
