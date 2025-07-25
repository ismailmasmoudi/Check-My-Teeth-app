import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { QuestionFlowComponent } from './components/question-flow/question-flow.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ToothSelectorComponent } from './components/tooth-selector/tooth-selector.component';
import { Diagnosis } from './services/diagnosis.service';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { ToothStatusFlowComponent } from './components/tooth-status-flow/tooth-status-flow.component';
import { InfoMenuComponent } from './components/info-menu/info-menu.component';
import { FormsModule } from '@angular/forms';
import {
  DataLoggerService,
  DiagnosisData,
} from './services/data-logger.service';
import {
  NAME_PROMPT_TEXT,
  NAME_INPUT_PLACEHOLDER,
  CONTINUE_BUTTON_LABEL,
  GREETINGS,
  PAIN_TYPE_QUESTION_TEXT,
  SELECT_PAIN_TYPE_LABEL,
  PAIN_TYPES_TEXT,
  BACK_BUTTON_LABEL,
  START_OVER_BUTTON_LABEL,
  DISCLAIMER_TEXT,
  NAME_ERROR_TEXT,
  PAIN_TYPES,
  CLOSE_BUTTON_LABEL,
  DIAGNOSIS_EXPLANATION_LABEL,
  DIAGNOSIS_TREATMENT_LABEL,
  PRIVACY_CONSENT_TEXT_PARTS,
  PRIVACY_POLICY_LINK_TEXT,
  IMPORTANT_NOTICE_TEXT,
  DIAGNOSING_TEXT,
} from './translations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    QuestionFlowComponent,
    ToothStatusFlowComponent,
    CommonModule,
    ToothSelectorComponent,
    LanguageSelectorComponent,
    InfoMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild(QuestionFlowComponent)
  questionFlowComponent?: QuestionFlowComponent;
  @ViewChild(InfoMenuComponent) infoMenuComponent!: InfoMenuComponent;

  selectedLanguage: 'en' | 'fr' | 'de' | 'ar' = this.getInitialLanguage();
  patientName: string | null = null;
  greeting: string = '';
  privacyConsent = false;
  isDiagnosing = false;
  selectedPainType: string | null = null;
  selectedTooth: number | null = null;
  finalDiagnosis: Diagnosis | null = null;
  isToothStatusFlowComplete = false;
  splashState: 'visible' | 'hiding' | 'hidden' = 'visible';
  infoContentHtml: string | null = null;
  collectedSymptoms: string = '';
  diagnosisTitle: string = '';
  diagnosisExplanation: string = '';
  diagnosisTreatment: string = '';
  showNameError = false;
  painTypeIndex = 0;
  infoManuallyClosed = false;

  namePromptText = NAME_PROMPT_TEXT;
  nameInputPlaceholder = NAME_INPUT_PLACEHOLDER;
  continueButtonLabel = CONTINUE_BUTTON_LABEL;
  greetings = GREETINGS;
  painTypeQuestionText = PAIN_TYPE_QUESTION_TEXT;
  selectPainTypeLabel = SELECT_PAIN_TYPE_LABEL;
  painTypesText = PAIN_TYPES_TEXT;
  backButtonLabel = BACK_BUTTON_LABEL;
  startOverButtonLabel = START_OVER_BUTTON_LABEL;
  disclaimerText = DISCLAIMER_TEXT;
  nameErrorText = NAME_ERROR_TEXT;
  painTypes = PAIN_TYPES;
  closeButtonLabel = CLOSE_BUTTON_LABEL;
  diagnosisExplanationLabel = DIAGNOSIS_EXPLANATION_LABEL;
  diagnosisTreatmentLabel = DIAGNOSIS_TREATMENT_LABEL;
  privacyConsentTextParts = PRIVACY_CONSENT_TEXT_PARTS;
  privacyPolicyLinkText = PRIVACY_POLICY_LINK_TEXT;
  importantNoticeText = IMPORTANT_NOTICE_TEXT;
  diagnosingText = DIAGNOSING_TEXT;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dataLoggerService: DataLoggerService
  ) {}

  /**
   * Component initialization lifecycle hook
   * Loads stored patient name, sets up language preferences, and manages splash screen animation
   */
  ngOnInit(): void {
    const storedName = localStorage.getItem('patientName');
    if (storedName) {
      this.patientName = storedName;
      this.setGreeting();
    }
    this.updateHtmlLangAndDir(this.selectedLanguage);

    setTimeout(() => {
      this.splashState = 'hiding';
      setTimeout(() => {
        this.splashState = 'hidden';
      }, 500);
    }, 1500);
  }

  /**
   * Determines the initial language based on localStorage or browser preferences
   * @returns The selected language code
   */
  private getInitialLanguage(): 'en' | 'fr' | 'de' | 'ar' {
    const supportedLanguages: ('en' | 'fr' | 'de' | 'ar')[] = [
      'en',
      'fr',
      'de',
      'ar',
    ];

    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang && supportedLanguages.includes(storedLang as any)) {
      return storedLang as 'en' | 'fr' | 'de' | 'ar';
    }

    const browserLang = navigator.language.split('-')[0];
    const foundLang = supportedLanguages.find((lang) => lang === browserLang);

    return foundLang || 'en';
  }

  /**
   * Handles patient name submission with validation
   * Validates name format and saves to localStorage if valid
   * @param name The submitted patient name
   */
  onNameSubmitted(name: string): void {
    if (!this.privacyConsent) {
      return;
    }

    const trimmed = name ? name.trim() : '';
    const isValid =
      trimmed.length >= 2 &&
      /[a-zA-Z\u0600-\u06FF]/.test(trimmed) &&
      !/^\d+$/.test(trimmed);

    if (!isValid) {
      this.showNameError = true;
      return;
    }
    this.showNameError = false;

    this.patientName = trimmed;
    localStorage.setItem('patientName', this.patientName);
    this.setGreeting();
  }

  /**
   * Sets the appropriate greeting based on time of day and patient name
   * Updates the greeting message according to current hour and selected language
   */
  private setGreeting(): void {
    if (!this.patientName) {
      this.greeting = '';
      return;
    }

    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening';

    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    this.greeting = `${this.greetings[timeOfDay][this.selectedLanguage]} ${
      this.patientName
    }!`;
  }

  /**
   * Handles the completion of diagnosis process
   * Displays diagnosis animation and saves result to data service
   * @param result The completed diagnosis object
   */
  onDiagnosisReady(result: Diagnosis): void {
    if (result) {
      this.isDiagnosing = true;
      setTimeout(() => {
        this.finalDiagnosis = result;
        this.isDiagnosing = false;

        this.diagnosisTitle = result.title[this.selectedLanguage];
        this.diagnosisExplanation = result.explanation[this.selectedLanguage];
        this.diagnosisTreatment = result.treatment[this.selectedLanguage];

        this.saveDiagnosis();
      }, 5000);
    }
  }

  /**
   * Handles completion of tooth status flow when no diagnosis is found
   * Transitions to general pain questions for further diagnosis
   */
  onToothStatusFlowCompleted() {
    this.isToothStatusFlowComplete = true;
  }

  /**
   * Handles pain type selection from user input
   * @param painType The selected pain type (tooth, gum, or tmj)
   */
  onPainTypeSelected(painType: string) {
    this.selectedPainType = painType;
  }

  /**
   * Handles tooth selection from tooth selector component
   * @param toothId The selected tooth identification number
   */
  onToothSelected(toothId: number) {
    this.selectedTooth = toothId;
  }

  /**
   * Handles language change events
   * Updates language preferences and resets info page if manually closed
   * @param lang The selected language code
   */
  onLanguageChanged(lang: 'en' | 'fr' | 'de' | 'ar') {
    this.selectedLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    this.updateHtmlLangAndDir(lang);
    this.setGreeting();

    if (this.infoManuallyClosed) {
      this.infoContentHtml = null;
    }
  }

  /**
   * Handles info page content changes from info menu component
   * Manages info page display state and manual close tracking
   * @param content The HTML content to display, or null to close
   */
  onInfoPageChange(content: string | null): void {
    if (content === null) {
      this.infoContentHtml = null;
      this.infoManuallyClosed = true;
      if (this.infoMenuComponent) {
        this.infoMenuComponent.clearSelection();
      }
    } else {
      this.infoContentHtml = content;
      this.infoManuallyClosed = false;
    }
  }

  /**
   * Updates HTML document language and direction attributes
   * Sets proper RTL/LTR text direction based on selected language
   * @param lang The language code to apply
   */
  private updateHtmlLangAndDir(lang: 'en' | 'fr' | 'de' | 'ar'): void {
    this.renderer.setAttribute(this.document.documentElement, 'lang', lang);
    if (lang === 'ar') {
      this.renderer.setAttribute(this.document.documentElement, 'dir', 'rtl');
    } else {
      this.renderer.setAttribute(this.document.documentElement, 'dir', 'ltr');
    }
  }

  /**
   * Handles back navigation through different application states
   * Manages navigation between question flows, tooth selection, and pain type selection
   */
  triggerBackAction() {
    if (this.questionFlowComponent) {
      this.questionFlowComponent.goBackInternal();
      return;
    }

    if (this.selectedPainType === 'tooth' && this.selectedTooth) {
      this.selectedTooth = null;
      return;
    }

    if (this.selectedPainType === 'tooth' && !this.selectedTooth) {
      this.selectedPainType = null;
      return;
    }
  }

  /**
   * Handles back navigation from question flow component
   * Manages transition between tooth status flow and pain type selection
   */
  onQuestionFlowBack() {
    if (this.selectedPainType === 'tooth' && this.isToothStatusFlowComplete) {
      this.isToothStatusFlowComplete = false;
    } else {
      this.selectedPainType = null;
    }
  }

  /**
   * Resets all application state to initial values
   * Clears patient data, selections, and diagnosis results from memory and storage
   */
  resetSelection() {
    this.patientName = null;
    this.greeting = '';
    this.selectedPainType = null;
    this.selectedTooth = null;
    this.finalDiagnosis = null;
    this.isDiagnosing = false;
    this.isToothStatusFlowComplete = false;
    this.collectedSymptoms = '';
    this.diagnosisTitle = '';
    this.diagnosisExplanation = '';
    this.diagnosisTreatment = '';
    localStorage.removeItem('patientName');

    this.infoManuallyClosed = false;
  }

  /**
   * Opens the privacy policy page through the info menu component
   * @param event The mouse click event (prevented to avoid default link behavior)
   */
  openPrivacyPolicy(event: MouseEvent) {
    event.preventDefault();
    this.infoMenuComponent.openPage('privacy');
  }

  /**
   * Navigates to the previous pain type in the selection carousel
   */
  selectPrevPainType() {
    this.painTypeIndex =
      (this.painTypeIndex - 1 + this.painTypes.length) % this.painTypes.length;
  }

  /**
   * Navigates to the next pain type in the selection carousel
   */
  selectNextPainType() {
    this.painTypeIndex = (this.painTypeIndex + 1) % this.painTypes.length;
  }

  /**
   * Saves the current diagnosis data to the data logging service
   * Collects all patient information and diagnosis results for storage
   */
  saveDiagnosis() {
    const diagnosisData: DiagnosisData = {
      timestamp: new Date().toISOString(),
      name: this.patientName,
      language: this.selectedLanguage,
      painType: this.selectedPainType,
      toothNumber: this.selectedTooth,
      symptoms:
        this.collectedSymptoms || 'Patient reported no specific symptoms',
      diagnosisTitle: this.diagnosisTitle,
      diagnosisExplanation: this.diagnosisExplanation,
      diagnosisTreatment: this.diagnosisTreatment,
    };
    this.dataLoggerService.logDiagnosis(diagnosisData);
  }
}
