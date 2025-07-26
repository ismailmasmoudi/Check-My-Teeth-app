import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

type Language = 'en' | 'fr' | 'de' | 'ar';
type SupportedLang = 'de' | 'en' | 'fr' | 'ar';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit, OnChanges {
  @Input() currentLang: Language = 'en';

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

  /**
   * Initializes the component with the current language setting
   */
  ngOnInit(): void {
    this.selectedLanguage = this.currentLang as SupportedLang;
  }
  
  /**
   * Updates the selected language when input changes
   * @param changes Object containing the changed properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentLang'] && changes['currentLang'].currentValue) {
      this.selectedLanguage = changes['currentLang'].currentValue as SupportedLang;
    }
  }

  /**
   * Handles language change from dropdown selection
   * @param event The change event from the select element
   */
  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.languageChanged.emit(selectElement.value as Language);
  }

  /**
   * Selects the previous language in the language array
   */
  selectPrevLang() {
    const idx = this.languages.indexOf(this.selectedLanguage);
    this.selectedLanguage = this.languages[(idx - 1 + this.languages.length) % this.languages.length] as SupportedLang;
    this.languageChanged.emit(this.selectedLanguage);
    this.triggerFlip();
  }

  /**
   * Selects the next language in the language array
   */
  selectNextLang() {
    const idx = this.languages.indexOf(this.selectedLanguage);
    this.selectedLanguage = this.languages[(idx + 1) % this.languages.length] as SupportedLang;
    this.languageChanged.emit(this.selectedLanguage);
    this.triggerFlip();
  }

  /**
   * Triggers the flip animation for language selection
   */
  triggerFlip() {
    this.isFlipped = true;
    setTimeout(() => this.isFlipped = false, 400);
  }
}
