
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
  }
}
