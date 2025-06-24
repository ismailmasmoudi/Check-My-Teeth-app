
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { QuestionFlowService, Question } from '../../services/question-flow.service';
import { DiagnosisService, Diagnosis } from '../../services/diagnosis.service';
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
  imports: [CommonModule],
  templateUrl: './question-flow.component.html',
  styleUrls: ['./question-flow.component.scss']
})
export class QuestionFlowComponent implements OnChanges {
  @Input() painType!: string;
  @Input() language: Language = 'en';
  @Output() back = new EventEmitter<void>();
  @Output() diagnosisReady = new EventEmitter<{ title: string; explanation: string; treatment: string }>();

  // Component State
  allQuestions: Question[] = [];
  currentQuestion: Question | null = null;

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
      const diagnosis = this.diagnosisService.getDiagnosisById(option.diagnosisId);
      if (diagnosis) {
        this.diagnosisReady.emit({
          title: diagnosis.title[this.language],
          explanation: diagnosis.explanation[this.language],
          treatment: diagnosis.treatment[this.language]
        });
      }
      this.currentQuestion = null;
    } else if (option.next) {
      this.currentQuestion = this.questionFlowService.getQuestionById(this.painType, option.next) || null;
    }
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
  }
}
