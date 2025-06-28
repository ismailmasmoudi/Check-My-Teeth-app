import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { QuestionFlowComponent } from './components/question-flow/question-flow.component';
import { CommonModule, DOCUMENT } from '@angular/common';

import { ToothSelectorComponent } from './components/tooth-selector/tooth-selector.component';
import { Diagnosis } from './services/diagnosis.service';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component'; // Import PainTypeSelectorComponent
import { ToothStatusFlowComponent } from './components/tooth-status-flow/tooth-status-flow.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    QuestionFlowComponent,
    ToothStatusFlowComponent,
    CommonModule,
    ToothSelectorComponent,
    LanguageSelectorComponent,
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(QuestionFlowComponent)
  questionFlowComponent?: QuestionFlowComponent;

  selectedLanguage: 'en' | 'fr' | 'de' | 'ar' = this.getInitialLanguage();

  selectedPainType: string | null = null;
  selectedTooth: string | null = null;
  finalDiagnosis: Diagnosis | null = null;
  isToothStatusFlowComplete = false;

    constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  painTypeQuestionText = {
    en: 'What type of pain do you have?',
    fr: 'Quel type de douleur avez-vous ?',
    de: 'Welche Art von Schmerzen haben Sie?',
    ar: 'ما نوع الألم الذي تعاني منه؟',
  };

  selectPainTypeLabel = {
    en: 'Select pain type',
    fr: 'Sélectionnez le type de douleur',
    de: 'Schmerzart auswählen',
    ar: 'اختر نوع الألم',
  };

  painTypesText = {
    tooth: {
      en: 'Tooth pain',
      fr: 'Douleur dentaire',
      de: 'Zahnschmerzen',
      ar: 'ألم الأسنان',
    },
    gum: {
      en: 'Gum pain',
      fr: 'Douleur des gencives',
      de: 'Zahnfleischschmerzen',
      ar: 'ألم اللثة',
    },
    tmj: {
      en: 'TMJ pain',
      fr: "Douleur de l'ATM",
      de: 'Kiefergelenkschmerzen',
      ar: 'ألم مفصل الفك',
    },
  };

  backButtonLabel = {
    en: 'Back',
    fr: 'Retour',
    de: 'Zurück',
    ar: 'رجوع',
  };

  diagnosisExplanationLabel: { [key: string]: string } = {
    en: 'Explanation',
    fr: 'Explication',
    de: 'Erklärung',
    ar: 'شرح',
  };

  diagnosisTreatmentLabel: { [key: string]: string } = {
    en: 'Suggested Treatment',
    fr: 'Traitement Suggéré',
    de: 'Vorgeschlagene Behandlung',
    ar: 'العلاج المقترح',
  };

  startOverButtonLabel = {
    en: 'Start Over',
    fr: 'Recommencer',
    de: 'Von vorne beginnen',
    ar: 'البدء من جديد',
  };
 ngOnInit(): void {
    this.updateHtmlLangAndDir(this.selectedLanguage);
  }

  private getInitialLanguage(): 'en' | 'fr' | 'de' | 'ar' {
    const supportedLanguages: ('en' | 'fr' | 'de' | 'ar')[] = [
      'en',
      'fr',
      'de',
      'ar',
    ];
    // Get the primary language code from the browser (e.g., 'de' from 'de-DE')
    const browserLang = navigator.language.split('-')[0];
    // Find if the browser language is in our supported list
    const foundLang = supportedLanguages.find((lang) => lang === browserLang);
    return foundLang || 'en'; // Fallback to English if not supported
  }

  onDiagnosisReady(result: Diagnosis) {
    // --- DEBUGGING STEP ---
    // Let's log the received result to the browser's console to see what's happening.
    console.log('onDiagnosisReady event received with:', result);

    // If the result is a valid diagnosis object, we set it.
    if (result) {
      this.finalDiagnosis = result;
    } else {
      // If we receive null or undefined, we log an error.
      console.error(
        'Diagnosis event was received, but the result was null or undefined. The view will not update.'
      );
    }
  }

  onToothStatusFlowCompleted() {
    // The tooth status flow is done, but no diagnosis was found.
    // We now need to show the general pain questions.
    this.isToothStatusFlowComplete = true;
  }

  onPainTypeSelected(painType: string) {
    this.selectedPainType = painType;
  }

  onToothSelected(toothId: string) {
    this.selectedTooth = toothId;
  }

  onLanguageChanged(lang: 'en' | 'fr' | 'de' | 'ar') {
    this.selectedLanguage = lang;
    this.updateHtmlLangAndDir(lang);
  }

  private updateHtmlLangAndDir(lang: 'en' | 'fr' | 'de' | 'ar'): void {
    this.renderer.setAttribute(this.document.documentElement, 'lang', lang);
    if (lang === 'ar') {
      this.renderer.setAttribute(this.document.documentElement, 'dir', 'rtl');
    } else {
      this.renderer.setAttribute(this.document.documentElement, 'dir', 'ltr');
    }
  }

  triggerBackAction() {
    // Case 1: The user is in the general question flow.
    // Delegate the back action to the component. It will either go back one question
    // or emit an event if it's at the beginning.
    if (this.questionFlowComponent) {
      this.questionFlowComponent.goBackInternal();
      return;
    }

    // Case 2: The user is in the tooth status flow. Go back to the tooth selector.
    if (this.selectedPainType === 'tooth' && this.selectedTooth) {
      this.selectedTooth = null;
      return;
    }

    // Case 3: The user is on the tooth selector screen. Go back to pain type selection.
    if (this.selectedPainType === 'tooth' && !this.selectedTooth) {
      this.selectedPainType = null;
      return;
    }
  }

  onQuestionFlowBack() {
    // This event is fired by QuestionFlowComponent when trying to go "back" from the first question.

    // If we came from the tooth status flow, go back to it.
    if (this.selectedPainType === 'tooth' && this.isToothStatusFlowComplete) {
      this.isToothStatusFlowComplete = false; // This hides QuestionFlow and shows ToothStatusFlow again.
    } else {
      // For 'gum' or 'tmj' pain, go back to the pain type selection screen.
      this.selectedPainType = null;
    }
  }

  resetSelection() {
    this.selectedPainType = null;
    this.selectedTooth = null;
    this.finalDiagnosis = null;
    this.isToothStatusFlowComplete = false;
  }
}
