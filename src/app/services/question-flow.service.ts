import { Injectable } from '@angular/core';
import toothQuestions from '../data/questions-tooth.json';
import gumQuestions from '../data/questions-gum.json';
import tmjQuestions from '../data/questions-tmj.json';

export interface Question {
  id: string;
  text: { en: string; fr: string; ar: string; de: string };
  options: { label: { en: string; fr: string; ar: string; de: string }; next?: string; diagnosisId?: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class QuestionFlowService {
  private questionsMap: Record<string, Question[]> = { // Type '{}' is missing the following properties from type 'Question[]': length, pop, push, concat, and 29 more.
    tooth: toothQuestions as Question[],
    gum: gumQuestions as Question[],
    tmj: tmjQuestions as Question[]
  };

  getQuestions(painType: string): Question[] {
    return this.questionsMap[painType] || [];
  }

  getQuestionById(painType: string, id: string): Question | undefined {
    return this.getQuestions(painType).find(q => q.id === id);
  }
}
