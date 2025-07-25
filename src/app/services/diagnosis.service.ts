import { Injectable } from '@angular/core';
import diagnosesData from '../data/diagnoses.json';

/**
 * Interface defining the structure of a medical diagnosis
 * Contains multilingual support for title, explanation, and treatment information
 */
export interface Diagnosis {
  id: string;
  title: { en: string; fr: string; ar: string; de: string };
  explanation: { en: string; fr: string; ar: string; de: string };
  treatment: { en: string; fr: string; ar: string; de: string };
}

/**
 * Service responsible for managing medical diagnoses
 * Provides access to diagnosis data and retrieval functionality
 */
@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {
  private diagnoses = diagnosesData;

  /**
   * Retrieves a specific diagnosis by its unique identifier
   * @param id The unique identifier of the diagnosis
   * @returns The diagnosis object if found, undefined otherwise
   */
  getDiagnosisById(id: string): Diagnosis | undefined {
    return this.diagnoses.find(d => d.id === id);
  }
}
