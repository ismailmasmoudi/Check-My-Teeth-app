
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { QuestionFlowService, Question } from '../../services/question-flow.service';
import { DiagnosisService, Diagnosis } from '../../services/diagnosis.service';
import { DiagnosisResultComponent } from '../diagnosis-result/diagnosis-result.component';
import { CommonModule } from '@angular/common';

// For better type safety inside the component
type Language = 'en' | 'fr' | 'ar' | 'de';
interface Option {
  label: { [key in Language]: string };
  next?: string;
  diagnosisId?: string;
}

@Component({
  selector: 'app-question-flow',
  standalone: true,
  imports: [CommonModule, DiagnosisResultComponent],
  templateUrl: './question-flow.component.html',
  styleUrls: ['./question-flow.component.scss']
})
export class QuestionFlowComponent implements OnChanges {
  @Input() painType!: string;
  @Input() language: Language = 'en';
  @Output() back = new EventEmitter<void>();

  // Component State
  allQuestions: Question[] = [];
  currentQuestion: Question | null = null;
  selectedDiagnosis: Diagnosis | null = null;

  // History for internal back-navigation
  private questionHistory: Question[] = [];

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

    if (option.diagnosisId) {
      this.selectedDiagnosis = this.diagnosisService.getDiagnosisById(option.diagnosisId) || null;
      this.currentQuestion = null;
    } else if (option.next) {
      this.currentQuestion = this.questionFlowService.getQuestionById(this.painType, option.next) || null;
    }
  }

  public goBackInternal(): void {
    // If a diagnosis is shown, go back to the last question
    if (this.selectedDiagnosis) {
      this.selectedDiagnosis = null;
      this.currentQuestion = this.questionHistory.pop() || null;
    }
    // If we are on a question and there's history, go to the previous question
    else if (this.questionHistory.length > 0) {
      this.currentQuestion = this.questionHistory.pop() || null;
    }
    // If there's no more history, tell the parent component to take over
    else {
      this.back.emit();
    }
  }

  private resetState(): void {
    this.currentQuestion = null;
    this.selectedDiagnosis = null;
    this.allQuestions = [];
    this.questionHistory = [];
  }
}
