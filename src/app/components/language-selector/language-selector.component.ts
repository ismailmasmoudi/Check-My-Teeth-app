import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the specific language type to ensure type safety throughout the component.
type Language = 'en' | 'fr' | 'de' | 'ar';
type SupportedLang = 'de' | 'en' | 'fr' | 'ar';

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

  flagIcons: Record<SupportedLang, string> = {
    de: 'img/icons/german.png',
    en: 'img/icons/englich.png',
    fr: 'img/icons/french.png',
    ar: 'img/icons/arabic.png'
  };

  languages = ['de', 'en', 'fr', 'ar'];
  selectedLanguage: SupportedLang = 'de';
  isFlipped = false;

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    // We emit its value, asserting it as our specific Language type. This makes the output type-safe.
    this.languageChanged.emit(selectElement.value as Language);
  }

  selectPrevLang() {
    const idx = this.languages.indexOf(this.selectedLanguage);
    this.selectedLanguage = this.languages[(idx - 1 + this.languages.length) % this.languages.length] as SupportedLang;
    this.languageChanged.emit(this.selectedLanguage); // <-- Sprache ändern!
    this.triggerFlip();
  }

  selectNextLang() {
    const idx = this.languages.indexOf(this.selectedLanguage);
    this.selectedLanguage = this.languages[(idx + 1) % this.languages.length] as SupportedLang;
    this.languageChanged.emit(this.selectedLanguage); // <-- Sprache ändern!
    this.triggerFlip();
  }

  triggerFlip() {
    this.isFlipped = true;
    setTimeout(() => this.isFlipped = false, 400); // Flip-Animation zurücksetzen
  }
}