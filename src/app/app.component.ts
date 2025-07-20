import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { QuestionFlowComponent } from './components/question-flow/question-flow.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ToothSelectorComponent } from './components/tooth-selector/tooth-selector.component';
import { Diagnosis } from './services/diagnosis.service';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component'; // Import PainTypeSelectorComponent
import { ToothStatusFlowComponent } from './components/tooth-status-flow/tooth-status-flow.component';
import { InfoMenuComponent } from './components/info-menu/info-menu.component';
import { FormsModule } from '@angular/forms';
import { DataLoggerService, DiagnosisData } from './services/data-logger.service';

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

  // Zustand für den neuen Splash-Screen
  splashState: 'visible' | 'hiding' | 'hidden' = 'visible';

  // Eigenschaft zum Speichern des HTML-Inhalts aus dem Info-Menü
  infoContentHtml: string | null = null;

  // Übersetzungen für den neuen Schließen-Button
  closeButtonLabel = {
    en: 'Close',
    fr: 'Fermer',
    de: 'Schließen',
    ar: 'إغلاق',
  };
  collectedSymptoms: string = '';
  diagnosisTitle: string = '';
  diagnosisExplanation: string = '';
  diagnosisTreatment: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dataLoggerService: DataLoggerService
  ) {}

  namePromptText = {
    en: 'Hi there! Before we begin, may I kindly ask for your name?',
    de: 'Hallo! Bevor wir starten, darf ich bitte Ihren Namen wissen?',
    fr: 'Bonjour ! Avant de commencer, puis-je vous demander votre prénom ?',
    ar: 'مرحبًا! قبل أن نبدأ، هل لي أن أعرف اسمك من فضلك؟',
  };

  nameInputPlaceholder = {
    en: 'Your name',
    de: 'Ihr Name',
    fr: 'Votre nom',
    ar: 'اسمك',
  };

  continueButtonLabel = {
    en: 'Continue',
    de: 'Weiter',
    fr: 'Continuer',
    ar: 'متابعة',
  };

  greetings = {
    morning: {
      en: 'Good morning,',
      de: 'Guten Morgen,',
      fr: 'Bonjour,',
      ar: 'صباح الخير،',
    },
    afternoon: {
      en: 'Good afternoon,',
      de: 'Guten Tag,',
      fr: 'Bonjour,', // French uses Bonjour for both
      ar: 'مساء الخير،',
    },
    evening: {
      en: 'Good evening,',
      de: 'Guten Abend,',
      fr: 'Bonsoir,',
      ar: 'مساء الخير،',
    },
  };

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
      en: 'Jaw Joint Pain',
      fr: "Douleur à l'articulation de la mâchoire",
      de: 'Kiefergelenkschmerzen',
      ar: 'ألم في مفصل الفك',
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

  disclaimerText = {
    en: 'The diagnosis shown here is based on the information you have provided and is approximately 80 % accurate. However, a clinical examination in a dental practice is necessary for an exact diagnosis. If necessary, an X-ray should also be taken.',
    fr: 'Le diagnostic affiché ici est basé sur les informations que vous avez fournies et est correct à environ 80 %. Cependant, un examen clinique dans un cabinet dentaire est nécessaire pour un diagnostic exact. Si nécessaire, une radiographie doit également être réalisée.',
    de: 'Die hier angezeigte Diagnose basiert auf den von Ihnen angegebenen Informationen und ist mit einer Wahrscheinlichkeit von etwa 80 % korrekt. Für eine exakte Diagnose ist jedoch eine klinische Untersuchung in einer Zahnarztpraxis erforderlich. Falls notwendig, sollte zusätzlich ein Röntgenbild angefertigt werden.',
    ar: 'التشخيص المعروض هنا يعتمد على المعلومات التي قدمتها وهو صحيح بنسبة 80 % تقريبًا. ومع ذلك، فإن الفحص السريري في عيادة الأسنان ضروري لتشخيص دقيق. إذا لزم الأمر، يجب أيضًا إجراء صورة أشعة.',
  };

  privacyConsentTextParts = {
    en: [
      'I have read the ',
      ' and agree to the processing of my data as described therein.',
    ],
    de: [
      'Ich habe die ',
      ' gelesen und stimme der Verarbeitung meiner Daten wie dort beschrieben zu.',
    ],
    fr: [
      "J'ai lu la ",
      " et j'accepte le traitement de mes données tel qu'il y est décrit.",
    ],
    ar: ['لقد قرأت ', ' وأوافق على معالجة بياناتي كما هو موضح فيها.'],
  };

  privacyPolicyLinkText = {
    en: 'privacy policy',
    de: 'Datenschutzerklärung',
    fr: 'politique de confidentialité',
    ar: 'سياسة الخصوصية',
  };

  importantNoticeText = {
    en: 'Important:',
    de: 'Wichtig:',
    fr: 'Important :',
    ar: 'مهم:',
  };

  diagnosingText = {
    en: 'Creating diagnosis...',
    de: 'Diagnose wird erstellt...',
    fr: 'Création du diagnostic...',
    ar: 'جاري إنشاء التشخيص...',
  };

  showNameError = false;
  nameErrorText = {
    de: 'Bitte geben Sie einen gültigen Namen ein. Zahlen und Sonderzeichen sind nicht erlaubt.',
    en: 'Please enter a valid name. Numbers and special characters are not allowed.',
    ar: 'يرجى إدخال اسم صحيح. الأرقام والرموز غير مسموح بها.',
    fr: 'Veuillez entrer un nom valide. Les chiffres et les caractères spéciaux ne sont pas autorisés.',
  };

  painTypes = [
    { value: 'tooth', label: { de: 'Zahn', en: 'Tooth', fr: 'Dent', ar: 'سن' } },
    { value: 'gum', label: { de: 'Zahnfleisch', en: 'Gum', fr: 'Gencive', ar: 'لثة' } },
    { value: 'tmj', label: { de: 'Kiefergelenk', en: 'Jaw joint', fr: 'Articulation', ar: 'مفصل الفك' } }
  ];

  painTypeIndex = 0;

  // Dies ist die URL deiner Google Apps Script Web App, die die Daten in Google Sheets speichert
  // Die URL enthält deine Script-ID und endet mit /exec
  private readonly scriptUrl = 'https://script.google.com/macros/s/AKfycbwXmTkgKfV8cJhORv0TRq7GBYd6RcmFqbsMUuk9riItOZasAYeWM0kf53yIVG4QP6ef/exec';

  ngOnInit(): void {
    // Load the patient's name from browser storage when the app starts
    const storedName = localStorage.getItem('patientName');
    if (storedName) {
      this.patientName = storedName;
      this.setGreeting();
    }
    this.updateHtmlLangAndDir(this.selectedLanguage);

    // Logik für den Splash-Screen
    // Startet die Ausblende-Animation nach 1.5 Sekunden
    setTimeout(() => {
      this.splashState = 'hiding';
      // Versteckt das Element komplett, nachdem die Animation (500ms) abgeschlossen ist
      setTimeout(() => {
        this.splashState = 'hidden';
      }, 500);
    }, 1500);
  }

  private getInitialLanguage(): 'en' | 'fr' | 'de' | 'ar' {
    const supportedLanguages: ('en' | 'fr' | 'de' | 'ar')[] = [
      'en',
      'fr',
      'de',
      'ar',
    ];

    // 1. Versuchen, die Sprache aus dem localStorage zu laden
    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang && supportedLanguages.includes(storedLang as any)) {
      return storedLang as 'en' | 'fr' | 'de' | 'ar';
    }

    // 2. Wenn nicht vorhanden, Browsersprache versuchen
    const browserLang = navigator.language.split('-')[0];
    const foundLang = supportedLanguages.find((lang) => lang === browserLang);

    // 3. Fallback auf Englisch
    return foundLang || 'en';
  }

  onNameSubmitted(name: string): void {
    if (!this.privacyConsent) {
      return;
    }

    // Name muss mindestens 2 Buchstaben enthalten und darf nicht nur Zahlen sein
    const trimmed = name ? name.trim() : '';
    const isValid =
      trimmed.length >= 2 &&
      /[a-zA-Z\u0600-\u06FF]/.test(trimmed) && // mind. ein Buchstabe (auch Arabisch)
      !/^\d+$/.test(trimmed); // nicht nur Zahlen

    if (!isValid) {
      this.showNameError = true;
      return;
    }
    this.showNameError = false;

    this.patientName = trimmed;
    localStorage.setItem('patientName', this.patientName);
    this.setGreeting();
  }

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

  onDiagnosisReady(result: Diagnosis): void {
    if (result) {
      this.isDiagnosing = true;
      setTimeout(() => {
        this.finalDiagnosis = result;
        this.isDiagnosing = false;
        
        // Speichere die relevanten Diagnose-Informationen
        this.diagnosisTitle = result.title[this.selectedLanguage];
        this.diagnosisExplanation = result.explanation[this.selectedLanguage];
        this.diagnosisTreatment = result.treatment[this.selectedLanguage];
        
        // Sammle Symptome aus den beantworteten Fragen
        if (this.questionFlowComponent) {
          this.collectedSymptoms = this.questionFlowComponent.getAnsweredQuestions();
        }
        
        // Speichere die Diagnose in Google Sheets
        this.saveDiagnosis();
      }, 5000); // 5 seconds
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

  onToothSelected(toothId: number) {
    this.selectedTooth = toothId;
  }

  onLanguageChanged(lang: 'en' | 'fr' | 'de' | 'ar') {
    this.selectedLanguage = lang;
    // Die ausgewählte Sprache im Browser speichern
    localStorage.setItem('selectedLanguage', lang);
    this.updateHtmlLangAndDir(lang);
    this.setGreeting();
  }

  /**
   * Event-Handler zum Empfangen des Inhalts vom Info-Menü.
   * @param content Der HTML-Inhalt, der angezeigt werden soll, oder null zum Schließen.
   */
  onInfoPageChange(content: string | null): void {
    this.infoContentHtml = content;
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
    this.patientName = null;
    this.greeting = '';
    this.selectedPainType = null;
    this.selectedTooth = null;
    this.finalDiagnosis = null;
    this.isDiagnosing = false;
    this.isToothStatusFlowComplete = false;
    // Auch die Diagnose-Daten zurücksetzen
    this.collectedSymptoms = '';
    this.diagnosisTitle = '';
    this.diagnosisExplanation = '';
    this.diagnosisTreatment = '';
    // Also clear the name from browser storage
    localStorage.removeItem('patientName');
  }

  openPrivacyPolicy(event: MouseEvent) {
    event.preventDefault();
    this.infoMenuComponent.openPage('privacy');
  }

  selectPrevPainType() {
    this.painTypeIndex = (this.painTypeIndex - 1 + this.painTypes.length) % this.painTypes.length;
  }

  selectNextPainType() {
    this.painTypeIndex = (this.painTypeIndex + 1) % this.painTypes.length;
  }

  saveDiagnosis() {
    const diagnosisData: DiagnosisData = {
      timestamp: new Date().toISOString(),
      name: this.patientName,
      language: this.selectedLanguage,
      painType: this.selectedPainType,
      toothNumber: this.selectedTooth,
      symptoms: this.collectedSymptoms,
      diagnosisTitle: this.diagnosisTitle,
      diagnosisExplanation: this.diagnosisExplanation,
      diagnosisTreatment: this.diagnosisTreatment
    };
    this.dataLoggerService.logDiagnosis(diagnosisData);
  }
}
