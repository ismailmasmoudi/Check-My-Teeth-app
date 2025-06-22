import { Component } from '@angular/core';
import { QuestionFlowComponent } from './components/question-flow/question-flow.component';
import { CommonModule } from '@angular/common';
import { PainTypeSelectorComponent } from './components/pain-type-selector/pain-type-selector.component'; // Import PainTypeSelectorComponent


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuestionFlowComponent, CommonModule, PainTypeSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
  title = 'DentApp';
  selectedPainType: string | null = null;
  language: 'en' | 'fr' | 'ar' | 'de' = 'en';

  constructor() {
    const browserLang = navigator.language.substring(0, 2).toLowerCase();
    if (['en', 'fr', 'ar', 'de'].includes(browserLang)) {
      this.language = browserLang as any;
    }
  }

  onPainTypeSelected(painType: string) {
    this.selectedPainType = painType;
  }
}
