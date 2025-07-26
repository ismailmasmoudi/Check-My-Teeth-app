import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Language = 'en' | 'fr' | 'de' | 'ar';

/**
 * Component for selecting individual teeth using FDI World Dental Federation notation
 * Displays an interactive dental chart where users can click on teeth to select them
 */
@Component({
  selector: 'app-tooth-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tooth-selector.component.html',
  styleUrls: ['./tooth-selector.component.scss'],
})
export class ToothSelectorComponent {
  @Input() language: Language = 'en';
  @Output() toothSelected = new EventEmitter<number>();

  toothIdentifier: number | null = null;

  titleText = {
    en: 'Select the affected tooth:',
    fr: 'Sélectionnez la dent affectée :',
    de: 'Wählen Sie den betroffenen Zahn aus:',
    ar: 'اختر السن المصاب:',
  };

  quadrantLabels = {
    upperRight: {
      en: 'Upper Right',
      de: 'Oben Rechts',
      fr: 'Supérieur Droit',
      ar: 'أعلى يمين',
    },
    upperLeft: {
      en: 'Upper Left',
      de: 'Oben Links',
      fr: 'Supérieur Gauche',
      ar: 'أعلى يسار',
    },
    lowerRight: {
      en: 'Lower Right',
      de: 'Unten Rechts',
      fr: 'Inférieur Droit',
      ar: 'أسفل يمين',
    },
    lowerLeft: {
      en: 'Lower Left',
      de: 'Unten Links',
      fr: 'Inférieur Gauche',
      ar: 'أسفل يسار',
    },
  };

  selectedToothText = {
    en: 'Selected Tooth:',
    fr: 'Dent sélectionnée :',
    de: 'Ausgewählter Zahn:',
    ar: 'السن المختار:',
  };

  confirmButtonText = {
    en: 'Confirm Selection',
    fr: 'Confirmer la sélection',
    de: 'Auswahl bestätigen',
    ar: 'تأكيد الاختيار',
  };

  teeth = {
    upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
    upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
    lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
    lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
  };

  /**
   * Gets the image path for a tooth based on its FDI number
   * @param toothId The FDI tooth identifier
   * @returns The relative path to the tooth image
   */
  getToothImagePath(toothId: number): string {
    const lastDigit = toothId % 10;
    return `/img/Teeth/T${lastDigit}.png`;
  }

  /**
   * Gets the CSS transform style for orienting tooth images correctly by quadrant
   * @param toothId The FDI tooth identifier
   * @returns CSS transform string for proper tooth orientation
   */
  getToothImageTransform(toothId: number): string {
    const quadrant = Math.floor(toothId / 10);
    switch (quadrant) {
      case 1:
        return 'none';
      case 2:
        return 'scaleX(-1)';
      case 3:
        return 'scale(-1, -1)';
      case 4:
        return 'scaleY(-1)';
      default:
        return 'none';
    }
  }

  /**
   * Selects a tooth from the dental chart
   * @param toothId The FDI identifier of the selected tooth
   */
  selectTooth(toothId: number): void {
    this.toothIdentifier = toothId;
  }

  /**
   * Confirms the current tooth selection and emits it to parent component
   */
  confirmSelection(): void {
    if (this.toothIdentifier !== null) {
      this.toothSelected.emit(this.toothIdentifier);
    }
  }
}
