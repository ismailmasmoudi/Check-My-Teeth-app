import { Injectable } from '@angular/core';

/**
 * Struktur der Diagnosedaten für die Übermittlung an Google Sheets
 */
export interface DiagnosisData {
  timestamp: string;
  name: string | null;
  language: string;
  painType: string | null;
  toothNumber: number | null;
  symptoms: string;
  diagnosisTitle: string;
  diagnosisExplanation: string;
  diagnosisTreatment: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataLoggerService {
  /**
   * URL der Google Apps Script Web App
   * Diese URL verweist auf ein Google Apps Script, das die Daten in Google Sheets speichert
   */
  private readonly scriptUrl = 'https://script.google.com/macros/s/AKfycbwXmTkgKfV8cJhORv0TRq7GBYd6RcmFqbsMUuk9riItOZasAYeWM0kf53yIVG4QP6ef/exec';

  constructor() { }

  logDiagnosis(data: DiagnosisData) {
    if (!this.scriptUrl) {
      return;
    }

    // Create JSON string from data (als Fallback)
    const jsonData = JSON.stringify(data);
    
    // Importiere die Diagnosedaten zur Referenz (dynamischer Import)
    import('../data/diagnoses.json').then(diagnosesModule => {
      const diagnoses = diagnosesModule.default;
      
      try {
        // Finde die Diagnose anhand des Titels
        const diagnosisId = this.findDiagnosisIdByTitle(diagnoses, data.diagnosisTitle, data.language);
        
        if (diagnosisId) {
          // Finde die englischen Texte für diese Diagnose
          const diagnosisEntry = diagnoses.find(d => d.id === diagnosisId);
          
          if (diagnosisEntry) {
            // Erstelle eine Kopie der Daten mit englischen Diagnosefeldern
            // Speichere die Originalwerte und überschreibe die Diagnosefelder mit englischen Werten
            const dataWithEnglishDiagnosis = {
              ...data,
              // Originale Felder in separaten Feldern speichern
              diagnosisTitle_original: data.diagnosisTitle,
              diagnosisExplanation_original: data.diagnosisExplanation,
              diagnosisTreatment_original: data.diagnosisTreatment,
              symptoms_original: data.symptoms,
              
              // Hauptfelder mit englischen Werten überschreiben
              diagnosisTitle: diagnosisEntry.title.en,
              diagnosisExplanation: diagnosisEntry.explanation.en,
              diagnosisTreatment: diagnosisEntry.treatment.en,
              
              // Für Symptome eine Kennzeichnung hinzufügen, dass sie aus der Originalsprache stammen
              symptoms: data.language !== 'en' 
                ? `[Original in ${data.language}] ${data.symptoms}` 
                : data.symptoms
            };
            
            // Sende Daten mit englischen Feldern
            const enhancedJsonData = JSON.stringify(dataWithEnglishDiagnosis);
            this.submitData(enhancedJsonData);
            return;
          }
        }
      } catch (error) {
        // Fehler beim Zugriff auf englische Diagnosetexte - stille Fehlerbehandlung
      }
      
      // Fallback: Verwende die ursprünglichen Daten, wenn keine englische Version gefunden wird
      this.submitData(jsonData);
    }).catch(() => {
      // Im Fehlerfall die Originaldaten verwenden
      this.submitData(jsonData);
    });
  }
  
  /**
   * Findet die Diagnose-ID anhand des Titels in der angegebenen Sprache
   */
  private findDiagnosisIdByTitle(diagnoses: any[], title: string, language: string): string | null {
    const selectedLanguage = language.toLowerCase();
    const supportedLanguages = ['en', 'de', 'fr', 'ar'];
    const lang = supportedLanguages.includes(selectedLanguage) ? selectedLanguage : 'en';
    
    const diagnosis = diagnoses.find(d => 
      d.title[lang] && d.title[lang].toLowerCase() === title.toLowerCase()
    );
    
    return diagnosis ? diagnosis.id : null;
  }
  
  /**
   * Sendet die Daten via Formular an Google Sheets
   */
  private submitData(jsonData: string): void {
    // Hidden iframe für die Formularübermittlung erstellen
    const iframeId = 'hidden-form-iframe';
    let iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.setAttribute('id', iframeId);
      iframe.setAttribute('name', iframeId);
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    
    // Formular erstellen und konfigurieren
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', this.scriptUrl);
    form.setAttribute('target', iframeId);
    
    // Verstecktes Eingabefeld für die Daten
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', 'data');
    hiddenField.setAttribute('value', jsonData);
    form.appendChild(hiddenField);
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}
