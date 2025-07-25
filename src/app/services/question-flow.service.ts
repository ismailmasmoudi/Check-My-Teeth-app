import { Injectable } from '@angular/core';
import toothQuestions from '../data/questions-tooth.json';
import gumQuestions from '../data/questions-gum.json';
import tmjQuestions from '../data/questions-tmj.json';

/**
 * Interface defining the structure of a question in the diagnostic flow
 */
export interface Question {
  id: string;
  text: { en: string; fr: string; ar: string; de: string };
  options: { label: { en: string; fr: string; ar: string; de: string }; next?: string; diagnosisId?: string }[];
}

/**
 * Service responsible for managing diagnostic questions for different pain types
 * Provides access to question sets for tooth, gum, and TMJ pain types
 */
@Injectable({
  providedIn: 'root'
})
export class QuestionFlowService {
  private questionsMap: Record<string, Question[]> = { 
    tooth: toothQuestions as Question[],
    gum: gumQuestions as Question[],
    tmj: tmjQuestions as Question[]
  };

  /**
   * Retrieves all questions for a specific pain type
   * @param painType The type of pain (tooth, gum, or tmj)
   * @returns Array of questions for the specified pain type
   */
  getQuestions(painType: string): Question[] {
    return this.questionsMap[painType] || [];
  }

  /**
   * Finds a specific question by its ID within a pain type category
   * @param painType The type of pain (tooth, gum, or tmj)
   * @param id The unique identifier of the question
   * @returns The question object if found, undefined otherwise
   */
  getQuestionById(painType: string, id: string): Question | undefined {
    return this.getQuestions(painType).find(q => q.id === id);
  }
}
