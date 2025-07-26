import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pain-type-selector',
  standalone: true,
  imports: [],
  templateUrl: './pain-type-selector.component.html',
  styleUrl: './pain-type-selector.component.scss',
})
export class PainTypeSelectorComponent {
  @Output() painTypeSelected = new EventEmitter<string>();

  selectPainType(type: string) {
    this.painTypeSelected.emit(type);
  }
}
