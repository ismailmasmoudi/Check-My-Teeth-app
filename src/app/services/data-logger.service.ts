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
      console.warn('Keine Script-URL konfiguriert, Daten werden nicht gesendet');
      return;
    }

    console.log('Starte Diagnoseprotokollierung:', {
      title: data.diagnosisTitle,
      language: data.language,
      symptomsLength: data.symptoms?.length || 0,
      symptomsType: typeof data.symptoms,
      symptomsPreview: data.symptoms?.substring(0, 50)
    });
    
    // Stelle sicher, dass symptoms ein String ist und nicht leer
    if (data.symptoms === undefined || data.symptoms === null) {
      console.warn('Logger: Keine Symptome gefunden (undefined/null)');
      data = { ...data, symptoms: 'Patient reported no specific symptoms' };
    } else if (typeof data.symptoms !== 'string') {
      console.warn('Logger: Symptome sind kein String:', typeof data.symptoms);
      data = { ...data, symptoms: JSON.stringify(data.symptoms) };
    } else if (data.symptoms.trim() === '') {
      console.warn('Logger: Leerer Symptom-String empfangen');
      data = { ...data, symptoms: 'Patient reported no specific symptoms' };
    } else {
      console.log('Logger: Gültige Symptome empfangen, Länge:', data.symptoms.length);
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
          console.log(`Diagnose-ID gefunden: ${diagnosisId}`);
          
          // Finde die englischen Texte für diese Diagnose
          const diagnosisEntry = diagnoses.find(d => d.id === diagnosisId);
          
          if (diagnosisEntry) {
            console.log('Englische Diagnose gefunden:', {
              title: diagnosisEntry.title.en,
              hasExplanation: !!diagnosisEntry.explanation.en,
              hasTreatment: !!diagnosisEntry.treatment.en
            });
            
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
              
              // Für Symptome eine optimierte englische Darstellung erstellen
              symptoms: this.formatSymptoms(data.symptoms, 'en')
            };
            
            // Sende Daten mit englischen Feldern
            const enhancedJsonData = JSON.stringify(dataWithEnglishDiagnosis);
            this.submitData(enhancedJsonData);
            return;
          } else {
            console.warn(`Keine Diagnoseeinträge für ID: ${diagnosisId} gefunden`);
          }
        } else {
          console.warn(`Keine Diagnose-ID für Titel gefunden: ${data.diagnosisTitle}`);
        }
      } catch (error) {
        // Fehler beim Zugriff auf englische Diagnosetexte - stille Fehlerbehandlung
      }
      
      // Fallback: Verwende die ursprünglichen Daten, wenn keine englische Version gefunden wird
      console.log('Fallback: Keine englische Version gefunden, sende Originaldaten');
      this.submitData(jsonData);
    }).catch((error) => {
      // Im Fehlerfall die Originaldaten verwenden
      console.error('Fehler beim Laden der Diagnosedaten:', error);
      this.submitData(jsonData);
    });
  }
  
  /**
   * Findet die Diagnose-ID anhand des Titels in der angegebenen Sprache
   * Behandelt auch kombinierte Diagnosen mit "und" oder "oder"
   */
  private findDiagnosisIdByTitle(diagnoses: any[], title: string | null, language: string): string | null {
    if (!title) {
      console.warn('Kein Diagnosetitel übergeben');
      return null;
    }
    const selectedLanguage = language.toLowerCase();
    const supportedLanguages = ['en', 'de', 'fr', 'ar'];
    const lang = supportedLanguages.includes(selectedLanguage) ? selectedLanguage : 'en';
    
    // Überprüfen, ob es sich um eine kombinierte Diagnose handelt
    const combinedIndicators = {
      'de': ['und', 'oder'],
      'en': ['and', 'or'],
      'fr': ['et', 'ou'],
      'ar': ['و', 'أو']
    };
    
    // Indikatorwörter für die aktuelle Sprache
    const indicators = combinedIndicators[lang as keyof typeof combinedIndicators] || combinedIndicators['en'];
    
    // Überprüfen, ob einer der Indikatoren im Titel vorkommt
    // Verbesserte Erkennung mit und ohne umgebende Leerzeichen
    const isCombined = indicators.some((indicator: string) => {
      const lowerTitle = title.toLowerCase();
      const lowerIndicator = indicator.toLowerCase();
      return lowerTitle.includes(` ${lowerIndicator} `) || 
             lowerTitle.includes(`${lowerIndicator} `) || 
             lowerTitle.includes(` ${lowerIndicator}`);
    });
    
    // Debug-Log
    console.log('Diagnosesuche:', { 
      title, 
      language, 
      isCombined,
      indicators
    });
    
    if (isCombined) {
      // Bei kombinierten Diagnosen nehmen wir die erste Teildiagnose
      // und versuchen, sie zu finden
      let firstPart = title;
      
      // Teile den String beim ersten Indikator
      for (const indicator of indicators) {
        // Verbesserte Regex, die auch Indikatorwörter am Anfang oder Ende findet
        const pattern = new RegExp(`(.*?)(\\s+|^)${indicator}(\\s+|$).*`, 'i');
        const match = title.match(pattern);
        if (match && match[1]) {
          firstPart = match[1].trim();
          console.log(`Extrahierter erster Teil mit Indikator '${indicator}':`, firstPart);
          break;
        }
      }
      
      // Fallback, wenn die Regex keine Übereinstimmung findet
      if (firstPart === title) {
        // Einfache Teilung am ersten Leerzeichen nach dem ersten Wort
        const simpleSplit = title.split(/\s+/);
        if (simpleSplit.length > 1) {
          // Nehme die ersten 1-3 Wörter, je nachdem was länger ist
          firstPart = simpleSplit.slice(0, Math.min(3, Math.ceil(simpleSplit.length / 2))).join(' ');
          console.log('Einfache Teilung als Fallback:', firstPart);
        }
      }
      
      console.log('Verwende ersten Teil der kombinierten Diagnose:', firstPart);
      
      // Suche nach der ersten Teildiagnose
      // Verbesserte Suche mit genauerer Übereinstimmung
      const partialMatches = diagnoses.filter(d => 
        d.title[lang] && 
        (
          // Prüfe auf exakte Übereinstimmung zuerst
          firstPart.toLowerCase() === d.title[lang].toLowerCase() || 
          // Prüfe, ob der Diagnose-Titel im ersten Teil enthalten ist
          firstPart.toLowerCase().includes(d.title[lang].toLowerCase()) ||
          // Prüfe, ob der erste Teil im Diagnose-Titel enthalten ist
          d.title[lang].toLowerCase().includes(firstPart.toLowerCase())
        )
      );
      
      // Sortiere die Matches nach Relevanz (kürzeste/exakteste zuerst)
      const partialMatch = partialMatches.length > 0 ? 
        partialMatches.sort((a, b) => 
          Math.abs(a.title[lang].length - firstPart.length) - 
          Math.abs(b.title[lang].length - firstPart.length)
        )[0] : null;
      
      if (partialMatch) {
        console.log('Teilübereinstimmung gefunden:', partialMatch.id);
        return partialMatch.id;
      }
    }
    
    // Standardsuche nach exakter Übereinstimmung
    const diagnosis = diagnoses.find(d => 
      d.title[lang] && d.title[lang].toLowerCase() === title.toLowerCase()
    );
    
    return diagnosis ? diagnosis.id : null;
  }
  
  /**
   * Formatiert die Symptome für die Speicherung in Google Sheets
   * Fügt eine Sprachmarkierung hinzu und übersetzt die Beschriftungen wenn möglich
   */
  private formatSymptoms(symptoms: string | null | undefined, language: string): string {
    // Defensive Programmierung: Behandle alle möglichen Eingabewerte
    if (symptoms === null || symptoms === undefined) {
      console.warn('Symptome sind null oder undefined');
      return 'Patient reported no specific symptoms';
    }
    
    // Debug-Ausgabe für besseres Verständnis
    console.log('Formatiere Symptome:', {
      symptoms: typeof symptoms === 'string' ? 
        (symptoms.length > 100 ? symptoms.substring(0, 100) + '...' : symptoms) : 
        `[${typeof symptoms}]`,
      length: typeof symptoms === 'string' ? symptoms.length : 0,
      language
    });
    
    // Für den Fall, dass symptoms kein String ist, konvertiere es
    const symptomText = typeof symptoms === 'string' ? 
      symptoms : 
      JSON.stringify(symptoms);
    
    // Wenn Symptome komplett fehlen oder leer sind
    if (!symptomText || symptomText.trim() === '' || symptomText === '{}' || symptomText === '[]') {
      console.warn('Keine oder leere Symptome gefunden, verwende Standardtext');
      return 'Patient reported no specific symptoms';
    }
    
    try {
      // Wenn die Sprache bereits Englisch ist, direkt zurückgeben
      if (language === 'en') {
        return symptomText;
      }
      
      // Übersetze die häufigsten Symptom-Label
      let translatedSymptoms = symptomText;
    
    // Ersetze deutsche Labels mit englischen
    if (language === 'de') {
      translatedSymptoms = translatedSymptoms
        .replace(/Frage:/gi, 'Question:')
        .replace(/Antwort:/gi, 'Answer:')
        .replace(/Ja/gi, 'Yes')
        .replace(/Nein/gi, 'No');
      console.log('Deutsche Labels ersetzt');
    }
    
    // Ersetze französische Labels mit englischen
    else if (language === 'fr') {
      translatedSymptoms = translatedSymptoms
        .replace(/Question:/gi, 'Question:')
        .replace(/Réponse:/gi, 'Answer:')
        .replace(/Oui/gi, 'Yes')
        .replace(/Non/gi, 'No');
      console.log('Französische Labels ersetzt');
    }
    
    // Für arabische Labels
    else if (language === 'ar') {
      translatedSymptoms = translatedSymptoms
        .replace(/سؤال:/g, 'Question:')
        .replace(/إجابة:/g, 'Answer:')
        .replace(/نعم/g, 'Yes')
        .replace(/لا/g, 'No');
      console.log('Arabische Labels ersetzt');
    }
    
    // Entferne mögliche JSON-Artefakte und formatiere die Symptome für bessere Lesbarkeit
    translatedSymptoms = translatedSymptoms
      .replace(/\\n/g, '\n')       // Ersetze \n Escape-Sequenzen mit echten Zeilenumbrüchen
      .replace(/\\"/g, '"')        // Ersetze \" mit "
      .replace(/\\'/g, "'")        // Ersetze \' mit '
      .replace(/"{/g, '{')         // Entferne Anführungszeichen vor JSON-Objekten
      .replace(/}"/g, '}')         // Entferne Anführungszeichen nach JSON-Objekten
      .replace(/"\[/g, '[')        // Entferne Anführungszeichen vor JSON-Arrays
      .replace(/\]"/g, ']');       // Entferne Anführungszeichen nach JSON-Arrays
    
    console.log('Symptome nach Formatierung:', translatedSymptoms.substring(0, 100) + '...');
    
    // Füge eine Sprachmarkierung hinzu
    const result = `[Original in ${language}]\n${translatedSymptoms}`;
    console.log('Symptome erfolgreich formatiert, Länge:', result.length);
    return result;
    
    } catch (error) {
      console.error('Fehler bei der Formatierung der Symptome:', error);
      return `Error formatting symptoms: ${symptoms ? symptoms.substring(0, 50) : 'empty'}`;
    }
  }

  /**
   * Sendet die Daten via Formular an Google Sheets
   */
  private submitData(jsonData: string): void {
    console.log('Sende Daten an Google Sheets', {
      dataLength: jsonData.length,
      dataPreview: jsonData.substring(0, 100) + '...'
    });
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
