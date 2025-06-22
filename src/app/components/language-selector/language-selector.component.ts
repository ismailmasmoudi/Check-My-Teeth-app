import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the specific language type to ensure type safety throughout the component.
type Language = 'en' | 'fr' | 'de' | 'ar';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'] // Assuming a SCSS file exists
})
export class LanguageSelectorComponent {
  // The current language can be passed in, and it's also strongly typed.
  @Input() currentLang: Language = 'en';

  // The EventEmitter is now strongly typed with the Language type.
  @Output() languageChanged = new EventEmitter<Language>();

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    // We emit its value, asserting it as our specific Language type. This makes the output type-safe.
    this.languageChanged.emit(selectElement.value as Language);
  }
}