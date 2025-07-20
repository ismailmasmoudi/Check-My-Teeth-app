import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { QuestionFlowService, Question } from '../../services/question-flow.service';
import { DiagnosisService, Diagnosis } from '../../services/diagnosis.service';
import { CommonModule } from '@angular/common';

// For better type safety inside the component
type Language = 'en' | 'fr' | 'ar' | 'de';
interface Condition {
  toothNumbers: number[];
  ifTrue: { next?: string; diagnosisId?: string };
  ifFalse: { next?: string; diagnosisId?: string };
}
interface Option {
  label: { [key in Language]: string };
  next?: string;
  diagnosisId?: string;
  condition?: Condition;
}

@Component({
  selector: 'app-question-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-flow.component.html',
  styleUrls: ['./question-flow.component.scss']
})
export class QuestionFlowComponent implements OnChanges {
  @Input() painType!: string;
  @Input() language: Language = 'en';
  @Input() selectedTooth: number | null = null;
  @Output() back = new EventEmitter<void>(); // This remains as is
  @Output() diagnosisReady = new EventEmitter<Diagnosis>(); // Change this to emit the full Diagnosis object
  @Output() symptomSummary = new EventEmitter<string>();

  // Component State
  allQuestions: Question[] = [];
  currentQuestion: Question | null = null;

  // History for internal back-navigation
  private questionHistory: Question[] = [];
  
  // Store answered questions and selected options for reporting
  private answeredQuestions: { question: string; answer: string }[] = [];

  constructor(
    private questionFlowService: QuestionFlowService,
    private diagnosisService: DiagnosisService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['painType']?.currentValue) {
      this.resetAndStart();
    }
  }

  private resetAndStart(): void {
    this.resetState();
    this.allQuestions = this.questionFlowService.getQuestions(this.painType);
    this.currentQuestion = this.allQuestions.length > 0 ? this.allQuestions[0] : null;
  }

  selectOption(option: Option): void {
    if (!this.currentQuestion) return;

    // Add the current question to our history before moving on
    this.questionHistory.push(this.currentQuestion);
    
    // Store the question and answer for reporting
    if (this.currentQuestion && option.label) {
      // Speichere Frage und Antwort immer auf Englisch
      const questionTextEn = this.currentQuestion.text.en;
      const answerTextEn = option.label.en;
      console.log('Speichere Frage/Antwort (EN):', {
        question: questionTextEn.substring(0, 30),
        answer: answerTextEn
      });
      this.answeredQuestions.push({
        question: questionTextEn,
        answer: answerTextEn
      });
    }

    if (option.condition) {
      if (this.selectedTooth === null) {
        console.error('A conditional option was chosen, but no tooth has been selected.');
        return;
      }

      const isWisdomTooth = option.condition.toothNumbers.includes(this.selectedTooth);
      const branch = isWisdomTooth ? option.condition.ifTrue : option.condition.ifFalse;

      if (branch.diagnosisId) {
        this.setDiagnosis(branch.diagnosisId);
      } else if (branch.next) {
        this.goToNextQuestion(branch.next);
      }
    } else if (option.diagnosisId) {
      this.setDiagnosis(option.diagnosisId);
    } else if (option.next) {
      this.goToNextQuestion(option.next);
    }
  }

  private setDiagnosis(diagnosisId: string): void {
    const diagnosis = this.diagnosisService.getDiagnosisById(diagnosisId);
    // Emit Symptom-Zusammenfassung bevor DiagnoseEnde
    const summary = this.getAnsweredQuestions();
    this.symptomSummary.emit(summary);
    if (diagnosis) {
      this.diagnosisReady.emit(diagnosis);
    }
    this.currentQuestion = null; // End of flow
  }

  private goToNextQuestion(questionId: string): void {
    this.currentQuestion = this.questionFlowService.getQuestionById(this.painType, questionId) || null;
  }
  public goBackInternal(): void {
    // If we are on a question and there's history, go to the previous question
    if (this.questionHistory.length > 0) {
      this.currentQuestion = this.questionHistory.pop() || null;
    }
    // If there's no more history, tell the parent component to take over
    else {
      this.back.emit();
    }
  }

  private resetState(): void {
    this.currentQuestion = null;
    this.allQuestions = [];
    this.questionHistory = [];
    this.answeredQuestions = [];
    console.log('Zustand zurückgesetzt - alle Fragen und Antworten gelöscht');
  }
  
  /**
   * Erstellt eine kurze Zusammenfassung der wichtigsten Symptome
   * @returns Eine Kurzfassung der Symptome für die Übersicht
   */
  private createSymptomSummary(): string {
    if (this.answeredQuestions.length === 0) {
      return 'Patient reported no specific symptoms';
    }
    
    // Finde positive Antworten (Ja, Schmerzen, etc.)
    const positiveAnswers = this.answeredQuestions.filter(qa => {
      const answer = qa.answer.toLowerCase();
      const isPositive = 
        answer.includes('ja') || 
        answer.includes('yes') || 
        answer.includes('oui') || 
        answer.includes('نعم') ||
        answer.includes('schmerz') || 
        answer.includes('pain') || 
        answer.includes('douleur') ||
        !answer.includes('nein') && 
        !answer.includes('no') && 
        !answer.includes('non') &&
        !answer.includes('لا');
      
      return isPositive;
    });
    
    // Erstelle eine Übersicht der positiven Symptome
    let keySymptoms = [];
    
    if (positiveAnswers.length > 0) {
      // Extrahiere wichtige Schlüsselwörter aus den Fragen
      for (const qa of positiveAnswers) {
        const question = qa.question.toLowerCase();
        
        // Suche nach wichtigen Symptomen in der Frage
        if (question.includes('schmerz') || question.includes('pain') || question.includes('douleur') || question.includes('ألم')) {
          keySymptoms.push('Pain');
        }
        if (question.includes('schwellung') || question.includes('swelling') || question.includes('gonflement') || question.includes('تورم')) {
          keySymptoms.push('Swelling');
        }
        if (question.includes('blut') || question.includes('blood') || question.includes('sang') || question.includes('دم')) {
          keySymptoms.push('Bleeding');
        }
        if (question.includes('kalt') || question.includes('cold') || question.includes('froid') || question.includes('بارد')) {
          keySymptoms.push('Cold sensitivity');
        }
        if (question.includes('heiß') || question.includes('warm') || question.includes('hot') || question.includes('chaud') || question.includes('ساخن')) {
          keySymptoms.push('Hot sensitivity');
        }
        if (question.includes('zahn') || question.includes('tooth') || question.includes('dent') || question.includes('سن')) {
          keySymptoms.push('Tooth issues');
        }
        if (question.includes('zahnfleisch') || question.includes('gum') || question.includes('gencive') || question.includes('لثة')) {
          keySymptoms.push('Gum issues');
        }
      }
    }
    
    // Entferne Duplikate
    keySymptoms = [...new Set(keySymptoms)];
    
    // Erstelle die Zusammenfassung
    if (keySymptoms.length > 0) {
      return `SUMMARY: Patient reports ${keySymptoms.join(', ')}`;
    } else if (positiveAnswers.length > 0) {
      return `SUMMARY: Patient reports ${positiveAnswers.length} positive symptoms`;
    } else {
      return `SUMMARY: Patient reports dental concerns with ${this.answeredQuestions.length} symptoms`;
    }
  }
  
  /**
   * Gibt die beantworteten Fragen und Antworten als formatierten String zurück
   * für die Speicherung in Google Sheets, mit einer kurzen Zusammenfassung
   */
  getAnsweredQuestions(): string {
    // Wenn keine Fragen beantwortet wurden, gebe Schmerztyp zurück
    // Wenn keine Fragen beantwortet wurden, gib Schmerztyp auf Englisch zurück
    if (!this.answeredQuestions || this.answeredQuestions.length === 0) {
      return `Pain type: ${this.painType}`;
    }

    // Kurze Zusammenfassung: Frage- und Antwort-Paare ordentlich formatiert
    // Verwende immer englische Labels für Speicherung
    const l = { question: 'Question', answer: 'Answer' };
    const summary = this.answeredQuestions
      .map(qa => `${l.question}: ${qa.question}; ${l.answer}: ${qa.answer}`)
      .join(' | ');
    console.log('Symptom-Zusammenfassung (Frage & Antwort):', summary);
    return summary;
  }
}
