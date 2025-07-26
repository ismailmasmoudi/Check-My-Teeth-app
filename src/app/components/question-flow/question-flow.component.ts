import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { QuestionFlowService, Question } from '../../services/question-flow.service';
import { DiagnosisService, Diagnosis } from '../../services/diagnosis.service';
import { CommonModule } from '@angular/common';

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
  @Output() back = new EventEmitter<void>();
  @Output() diagnosisReady = new EventEmitter<Diagnosis>();
  @Output() symptomSummary = new EventEmitter<string>();

  allQuestions: Question[] = [];
  currentQuestion: Question | null = null;

  private questionHistory: Question[] = [];
  
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

  /**
   * Resets component state and initializes questions based on pain type
   */
  private resetAndStart(): void {
    this.resetState();
    this.allQuestions = this.questionFlowService.getQuestions(this.painType);
    this.currentQuestion = this.allQuestions.length > 0 ? this.allQuestions[0] : null;
  }

  /**
   * Handles option selection and navigation through the question flow
   * @param option The selected option containing next question or diagnosis
   */
  selectOption(option: Option): void {
    if (!this.currentQuestion) return;
    this.questionHistory.push(this.currentQuestion);   
    if (this.currentQuestion && option.label) {
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

  /**
   * Sets final diagnosis and emits symptom summary and diagnosis
   * @param diagnosisId The ID of the diagnosis to set
   */
  private setDiagnosis(diagnosisId: string): void {
    const diagnosis = this.diagnosisService.getDiagnosisById(diagnosisId);
    const summary = this.getAnsweredQuestions();
    this.symptomSummary.emit(summary);
    if (diagnosis) {
      this.diagnosisReady.emit(diagnosis);
    }
    this.currentQuestion = null;
  }

  /**
   * Navigates to the next question in the flow
   * @param questionId The ID of the next question
   */
  private goToNextQuestion(questionId: string): void {
    this.currentQuestion = this.questionFlowService.getQuestionById(this.painType, questionId) || null;
  }

  /**
   * Handles backward navigation through the question flow
   */
  public goBackInternal(): void {
    if (this.questionHistory.length > 0) {
      this.currentQuestion = this.questionHistory.pop() || null;
    }
    else {
      this.back.emit();
    }
  }

  /**
   * Resets all component state to initial values
   */
  private resetState(): void {
    this.currentQuestion = null;
    this.allQuestions = [];
    this.questionHistory = [];
    this.answeredQuestions = [];
    console.log('Zustand zurückgesetzt - alle Fragen und Antworten gelöscht');
  }
  
  /**
   * Creates a brief summary of the main symptoms based on answered questions
   * @returns A short summary of symptoms for overview
   */
  private createSymptomSummary(): string {
    if (this.answeredQuestions.length === 0) {
      return 'Patient reported no specific symptoms';
    }
    
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
    
    let keySymptoms = [];
    
    if (positiveAnswers.length > 0) {
      for (const qa of positiveAnswers) {
        const question = qa.question.toLowerCase();
        
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
    
    keySymptoms = [...new Set(keySymptoms)];
    
    if (keySymptoms.length > 0) {
      return `SUMMARY: Patient reports ${keySymptoms.join(', ')}`;
    } else if (positiveAnswers.length > 0) {
      return `SUMMARY: Patient reports ${positiveAnswers.length} positive symptoms`;
    } else {
      return `SUMMARY: Patient reports dental concerns with ${this.answeredQuestions.length} symptoms`;
    }
  }
  
  /**
   * Returns answered questions and answers as formatted string for Google Sheets storage
   * @returns Formatted string with question-answer pairs
   */
  getAnsweredQuestions(): string {
    if (!this.answeredQuestions || this.answeredQuestions.length === 0) {
      return `Pain type: ${this.painType}`;
    }

    const l = { question: 'Question', answer: 'Answer' };
    const summary = this.answeredQuestions
      .map(qa => `${l.question}: ${qa.question}; ${l.answer}: ${qa.answer}`)
      .join(' | ');
    console.log('Symptom-Zusammenfassung (Frage & Antwort):', summary);
    return summary;
  }
}
