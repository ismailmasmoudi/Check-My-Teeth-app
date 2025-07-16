// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { catchError } from 'rxjs/operators';
// import { of } from 'rxjs';

// export interface DiagnosisData {
//   timestamp: string;
//   name: string | null;
//   language: string;
//   painType: string | null;
//   toothNumber: number | null;
//   symptoms: string; // Neues Feld für die Antworten als formatierter Text
//   diagnosisTitle: string;
//   diagnosisExplanation: string;
//   diagnosisTreatment: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class DataLoggerService {
//   // WICHTIG: Ersetzen Sie diese URL durch die URL Ihrer Google Apps Script Web App.
//   private readonly scriptUrl = 'https://script.google.com/u/2/home/projects/125_CAin5lS6mp3oFWK8JNsHv1zVOB6lzoiD9QetOe7G4X46w_apo_4p6/edit';

//   constructor(private http: HttpClient) { }

//   logDiagnosis(data: DiagnosisData) {
//     if (!this.scriptUrl || this.scriptUrl.includes('ismail.masmoudi.you@gmail.com')) {
//       console.warn('DataLoggerService: Google Apps Script URL ist nicht gesetzt. Daten werden nicht protokolliert.');
//       return;
//     }

//     // Google Apps Script erwartet POST-Anfragen mit dem Content-Type 'text/plain'.
//     this.http.post(this.scriptUrl, JSON.stringify(data), {
//       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
//     }).pipe(
//       catchError(error => {
//         console.error('Fehler beim Protokollieren der Daten in Google Sheet:', error);
//         return of(null); // Fehler elegant behandeln
//       })
//     ).subscribe(response => {
//       console.log('Daten erfolgreich protokolliert:', response);
//     });
//   }
// }
