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

  quadrantLabels = {
    upperRight: { en: 'Upper Right', fr: 'Supérieur Droit', de: 'Oben Rechts', ar: 'العلوي الأيمن' },
    upperLeft: { en: 'Upper Left', fr: 'Supérieur Gauche', de: 'Oben Links', ar: 'العلوي الأيسر' },
    lowerLeft: { en: 'Lower Left', fr: 'Inférieur Gauche', de: 'Unten Links', ar: 'السفلي الأيسر' },
    lowerRight: { en: 'Lower Right', fr: 'Inférieur Droit', de: 'Unten Rechts', ar: 'السفلي الأيمن' }
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