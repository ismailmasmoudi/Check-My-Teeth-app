import { Injectable } from '@angular/core';
import diagnosesData from '../data/diagnoses.json';

export interface Diagnosis {
  id: string;
  title: { en: string; fr: string; ar: string; de: string };
  description: { en: string; fr: string; ar: string; de: string };
  treatment: { en: string; fr: string; ar: string; de: string };
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {
  private diagnoses = diagnosesData;

  getDiagnosisById(id: string): Diagnosis | undefined {
    return this.diagnoses.find(d => d.id === id);
  }
}
