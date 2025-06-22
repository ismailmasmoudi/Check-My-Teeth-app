
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionFlowService, Question } from '../../services/question-flow.service';
import { DiagnosisService, Diagnosis } from '../../services/diagnosis.service';
import { DiagnosisResultComponent } from '../diagnosis-result/diagnosis-result.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-flow',
  standalone: true,
  imports: [CommonModule, DiagnosisResultComponent],
  templateUrl: './question-flow.component.html',
  styleUrl: './question-flow.component.scss'
})

export class QuestionFlowComponent implements OnChanges {
  @Input() painType!: string;
  @Input() language: 'en' | 'fr' | 'ar' | 'de' = 'en';

  currentQuestion: Question | null = null;
  questions: Question[] = [];
  selectedDiagnosis: Diagnosis | null = null;

  constructor(
    private questionFlowService: QuestionFlowService,
    private diagnosisService: DiagnosisService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['painType']) {
      this.questions = this.questionFlowService.getQuestions(this.painType);
      this.currentQuestion = this.questions.length > 0 ? this.questions[0] : null;
      this.selectedDiagnosis = null;
    }
  }

  selectOption(option: { label: any; next?: string; diagnosisId?: string }) {
    if (option.diagnosisId) {
      this.selectedDiagnosis = this.diagnosisService.getDiagnosisById(option.diagnosisId) || null;
      this.currentQuestion = null;
    } else if (option.next) {
      this.currentQuestion = this.questionFlowService.getQuestionById(this.painType, option.next) || null;
    }
  }
}
