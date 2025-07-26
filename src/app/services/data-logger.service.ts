import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  providedIn: 'root',
})
export class DataLoggerService {
  private readonly scriptUrl =
    'https://script.google.com/macros/s/AKfycbwXmTkgKfV8cJhORv0TRq7GBYd6RcmFqbsMUuk9riItOZasAYeWM0kf53yIVG4QP6ef/exec';

  constructor(private http: HttpClient) {}

  /**
   * Logs diagnosis data to Google Sheets with enhanced formatting and translation
   * @param data The diagnosis data to be logged
   */
  logDiagnosis(data: DiagnosisData) {
    if (!this.scriptUrl) {
      return;
    }

    if (data.symptoms === undefined || data.symptoms === null) {
      data = { ...data, symptoms: 'Patient reported no specific symptoms' };
    } else if (typeof data.symptoms !== 'string') {
      data = { ...data, symptoms: JSON.stringify(data.symptoms) };
    } else if (data.symptoms.trim() === '') {
      data = { ...data, symptoms: 'Patient reported no specific symptoms' };
    }

    const jsonData = JSON.stringify(data);

    import('../data/diagnoses.json')
      .then((diagnosesModule) => {
        const diagnoses = diagnosesModule.default;

        try {
          const diagnosisId = this.findDiagnosisIdByTitle(
            diagnoses,
            data.diagnosisTitle,
            data.language
          );

          if (diagnosisId) {
            const diagnosisEntry = diagnoses.find((d) => d.id === diagnosisId);

            if (diagnosisEntry) {
              const dataWithEnglishDiagnosis = {
                ...data,
                diagnosisTitle_original: data.diagnosisTitle,
                diagnosisExplanation_original: data.diagnosisExplanation,
                diagnosisTreatment_original: data.diagnosisTreatment,
                symptoms_original: data.symptoms,

                diagnosisTitle: diagnosisEntry.title.en,
                diagnosisExplanation: diagnosisEntry.explanation.en,
                diagnosisTreatment: diagnosisEntry.treatment.en,

                symptoms: this.formatSymptoms(data.symptoms, 'en'),
              };
              const enhancedJsonData = JSON.stringify(dataWithEnglishDiagnosis);
              this.submitData(enhancedJsonData);
              return;
            }
          }
        } catch (error) {
        }

        this.submitData(jsonData);
      })
      .catch((error) => {
        this.submitData(jsonData);
      });
  }

  /**
   * Finds the diagnosis ID based on the title in the specified language
   * Handles combined diagnoses with "and" or "or" connectors
   * @param diagnoses Array of diagnosis objects
   * @param title The diagnosis title to search for
   * @param language The language code for the search
   * @returns The diagnosis ID if found, null otherwise
   */
  private findDiagnosisIdByTitle(
    diagnoses: any[],
    title: string | null,
    language: string
  ): string | null {
    if (!title) {
      return null;
    }
    const selectedLanguage = language.toLowerCase();
    const supportedLanguages = ['en', 'de', 'fr', 'ar'];
    const lang = supportedLanguages.includes(selectedLanguage)
      ? selectedLanguage
      : 'en';

    const combinedIndicators = {
      de: ['und', 'oder'],
      en: ['and', 'or'],
      fr: ['et', 'ou'],
      ar: ['و', 'أو'],
    };

    const indicators =
      combinedIndicators[lang as keyof typeof combinedIndicators] ||
      combinedIndicators['en'];

    const isCombined = indicators.some((indicator: string) => {
      const lowerTitle = title.toLowerCase();
      const lowerIndicator = indicator.toLowerCase();
      return (
        lowerTitle.includes(` ${lowerIndicator} `) ||
        lowerTitle.includes(`${lowerIndicator} `) ||
        lowerTitle.includes(` ${lowerIndicator}`)
      );
    });

    if (isCombined) {
      let firstPart = title;

      for (const indicator of indicators) {
        const pattern = new RegExp(`(.*?)(\\s+|^)${indicator}(\\s+|$).*`, 'i');
        const match = title.match(pattern);
        if (match && match[1]) {
          firstPart = match[1].trim();
          break;
        }
      }

      if (firstPart === title) {
        const simpleSplit = title.split(/\s+/);
        if (simpleSplit.length > 1) {
          firstPart = simpleSplit
            .slice(0, Math.min(3, Math.ceil(simpleSplit.length / 2)))
            .join(' ');
        }
      }

      const partialMatches = diagnoses.filter(
        (d) =>
          d.title[lang] &&
          (firstPart.toLowerCase() === d.title[lang].toLowerCase() ||
            firstPart.toLowerCase().includes(d.title[lang].toLowerCase()) ||
            d.title[lang].toLowerCase().includes(firstPart.toLowerCase()))
      );

      const partialMatch =
        partialMatches.length > 0
          ? partialMatches.sort(
              (a, b) =>
                Math.abs(a.title[lang].length - firstPart.length) -
                Math.abs(b.title[lang].length - firstPart.length)
            )[0]
          : null;

      if (partialMatch) {
        return partialMatch.id;
      }
    }

    const diagnosis = diagnoses.find(
      (d) =>
        d.title[lang] && d.title[lang].toLowerCase() === title.toLowerCase()
    );

    return diagnosis ? diagnosis.id : null;
  }

  /**
   * Formats symptoms for storage in Google Sheets
   * Adds language markers and translates labels when possible
   * @param symptoms The symptom data to format
   * @param language The target language for formatting
   * @returns Formatted symptom string
   */
  private formatSymptoms(
    symptoms: string | null | undefined,
    language: string
  ): string {
    if (symptoms === null || symptoms === undefined) {
      return 'Patient reported no specific symptoms';
    }

    const symptomText =
      typeof symptoms === 'string' ? symptoms : JSON.stringify(symptoms);

    if (
      !symptomText ||
      symptomText.trim() === '' ||
      symptomText === '{}' ||
      symptomText === '[]'
    ) {
      return 'Patient reported no specific symptoms';
    }

    try {
      if (language === 'en') {
        return symptomText;
      }

      let translatedSymptoms = symptomText;

      if (language === 'de') {
        translatedSymptoms = translatedSymptoms
          .replace(/Frage:/gi, 'Question:')
          .replace(/Antwort:/gi, 'Answer:')
          .replace(/Ja/gi, 'Yes')
          .replace(/Nein/gi, 'No');
      } else if (language === 'fr') {
        translatedSymptoms = translatedSymptoms
          .replace(/Question:/gi, 'Question:')
          .replace(/Réponse:/gi, 'Answer:')
          .replace(/Oui/gi, 'Yes')
          .replace(/Non/gi, 'No');
      } else if (language === 'ar') {
        translatedSymptoms = translatedSymptoms
          .replace(/سؤال:/g, 'Question:')
          .replace(/إجابة:/g, 'Answer:')
          .replace(/نعم/g, 'Yes')
          .replace(/لا/g, 'No');
      }

      translatedSymptoms = translatedSymptoms
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/"{/g, '{')
        .replace(/}"/g, '}')
        .replace(/"\[/g, '[')
        .replace(/\]"/g, ']');

      const result = `[Original in ${language}]\n${translatedSymptoms}`;
      return result;
    } catch (error) {
      return `Error formatting symptoms: ${
        symptoms ? symptoms.substring(0, 50) : 'empty'
      }`;
    }
  }

  /**
   * Submits data to Google Sheets via HTTP POST request
   * @param jsonData The JSON data to submit
   */
  private submitData(jsonData: string): void {
    const formData = new FormData();
    formData.append('data', jsonData);

    this.http.post(this.scriptUrl, formData)
      .subscribe({
        next: (response) => {
          console.log('Data submitted successfully:', response);
        },
        error: (error) => {
          console.error('Error submitting data:', error);
          this.saveToLocalStorage(jsonData);
        }
      });
  }

  /**
   * Speichert Daten lokal wenn Google Sheets nicht erreichbar ist
   * @param data Die zu speichernden Daten
   */
  private saveToLocalStorage(data: string): void {
    try {
      const existingData = localStorage.getItem('pendingDiagnoses') || '[]';
      const pendingDiagnoses = JSON.parse(existingData);
      pendingDiagnoses.push({
        timestamp: new Date().toISOString(),
        data: data
      });
      localStorage.setItem('pendingDiagnoses', JSON.stringify(pendingDiagnoses));
      console.log('Data saved to local storage');
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }
}
