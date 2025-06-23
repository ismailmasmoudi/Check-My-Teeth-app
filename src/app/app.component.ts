import { Component, ViewChild } from '@angular/core';
import { QuestionFlowComponent } from './components/question-flow/question-flow.component';
import { CommonModule } from '@angular/common';
import { PainTypeSelectorComponent } from './components/pain-type-selector/pain-type-selector.component';
import { ToothSelectorComponent } from './components/tooth-selector/tooth-selector.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component'; // Import PainTypeSelectorComponent
import { ToothStatusFlowComponent } from './components/tooth-status-flow/tooth-status-flow.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    QuestionFlowComponent,
    ToothStatusFlowComponent,
    CommonModule,
    PainTypeSelectorComponent,
    ToothSelectorComponent,
    LanguageSelectorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(QuestionFlowComponent)
  questionFlowComponent?: QuestionFlowComponent;

  selectedLanguage: 'en' | 'fr' | 'de' | 'ar' = 'en';
  selectedPainType: string | null = null;
  selectedTooth: string | null = null;
  finalDiagnosis: { title: string; explanation: string; treatment: string } | null = null;
  isToothStatusFlowComplete = false;

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

  onDiagnosisReady(result: { title: string; explanation: string; treatment: string }) {
    this.finalDiagnosis = result;
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
  }

  triggerBackAction() {
    // If the question flow component is currently displayed, delegate the back action to it.
    // It will handle its internal history (going back to the previous question).
    if (this.questionFlowComponent) {
      this.questionFlowComponent.goBackInternal();
    }
    // If we are on the tooth selector screen, go back to the pain type selection.
    else if (this.selectedPainType === 'tooth' && !this.selectedTooth) {
      this.selectedPainType = null;
    } 
    // If we are on the tooth status flow, go back to the tooth selector
    else if (this.selectedPainType === 'tooth' && this.selectedTooth) {
      this.selectedTooth = null;
    }
  }

  onQuestionFlowBack() {
    // If we came from the tooth selector (i.e., pain type is 'tooth'), go back to it.
    if (this.selectedPainType === 'tooth') {
      this.selectedTooth = null;
    } else {
      // Otherwise, go back to the main pain type selection.
      this.resetSelection();
    }
  }

  resetSelection() {
    this.selectedPainType = null;
    this.selectedTooth = null;
    this.finalDiagnosis = null;
    this.isToothStatusFlowComplete = false;
  }
}
