import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Language = 'en' | 'fr' | 'de' | 'ar';

@Component({
  selector: 'app-tooth-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tooth-selector.component.html',
  styleUrls: ['./tooth-selector.component.scss']
})
export class ToothSelectorComponent {
  @Input() language: Language = 'en';
  @Output() toothSelected = new EventEmitter<number>();
  
  toothIdentifier: number | null = null; // Stores the currently selected tooth (e.g., 18)

  // Multilingual text objects
  titleText = {
    en: 'Select the affected tooth:',
    fr: 'Sélectionnez la dent affectée :',
    de: 'Wählen Sie den betroffenen Zahn aus:',
    ar: 'اختر السن المصاب:'
  };

  selectedToothText = {
    en: 'Selected Tooth:',
    fr: 'Dent sélectionnée :',
    de: 'Ausgewählter Zahn:',
    ar: 'السن المختار:'
  };

  confirmButtonText = {
    en: 'Confirm Selection',
    fr: 'Confirmer la sélection',
    de: 'Auswahl bestätigen',
    ar: 'تأكيد الاختيار'
  };

  // FDI World Dental Federation notation for permanent teeth
  // Organized by quadrant for easier rendering in the template
  teeth = {
    upperRight: [18, 17, 16, 15, 14, 13, 12, 11], // From wisdom tooth to central incisor
    upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],  // From central incisor to wisdom tooth
    lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],   // Quadrant 3: Patient's Lower Left
    lowerRight: [48, 47, 46, 45, 44, 43, 42, 41]  // Quadrant 4: Patient's Lower Right
  };

  // Method to get the image path for a tooth
  getToothImagePath(toothId: number): string {
    const lastDigit = toothId % 10;
    return `/img/Teeth/T${lastDigit}.png`;
  }

  // Method to get the CSS transform style for flipping the tooth image
  getToothImageTransform(toothId: number): string {
    const quadrant = Math.floor(toothId / 10);
    switch (quadrant) {
      case 1: return 'none'; // Upper Right, no transform
      case 2: return 'scaleX(-1)'; // Upper Left, horizontal flip
      case 3: return 'scale(-1, -1)'; // Lower Left, horizontal and vertical flip
      case 4: return 'scaleY(-1)'; // Lower Right, vertical flip
      default: return 'none';
    }
  }

  // Method to select a tooth from the schema
  selectTooth(toothId: number): void {
    this.toothIdentifier = toothId;
  }

  confirmSelection(): void {
    if (this.toothIdentifier !== null) {
      this.toothSelected.emit(this.toothIdentifier);
    }
  }
}