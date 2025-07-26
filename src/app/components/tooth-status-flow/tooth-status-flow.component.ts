import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Diagnosis, DiagnosisService } from '../../services/diagnosis.service';
import toothStatusFlowTexts from '../../data/tooth-status-flow-translations.json';

type Language = 'en' | 'fr' | 'de' | 'ar';

/**
 * Component for handling tooth status evaluation and diagnosis flow
 * Manages the diagnostic process for individual teeth based on their current condition
 */
@Component({
  selector: 'app-tooth-status-flow',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tooth-status-flow.component.html',
  styleUrls: ['./tooth-status-flow.component.scss'],
})
export class ToothStatusFlowComponent implements OnChanges {
  isDetailedFormValid() {
    throw new Error('Method not implemented.');
  }
  @Input() selectedTooth: string = '';
  @Input() language: Language = 'en';
  @Output() diagnosisReady = new EventEmitter<Diagnosis>();
  @Output() flowCompletedWithoutDiagnosis = new EventEmitter<void>();

  /**
   * Translation dictionary containing all multilingual text content
   * Imported from external translations file for better maintainability
   */
  private readonly allTexts = toothStatusFlowTexts as Record<string, Record<Language, string>>;

  private readonly wisdomTeeth = [18, 28, 38, 48];
  titleText: string = '';
  isWisdomTooth = false;

  /**
   * Lifecycle hook that responds to input property changes
   * Updates text translations and wisdom tooth status when inputs change
   * @param changes Object containing the changed properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['language'] || changes['selectedTooth']) {
      this.updateTexts();
      if (this.selectedTooth) {
        this.isWisdomTooth = this.wisdomTeeth.includes(
          parseInt(this.selectedTooth, 10)
        );
      }
    }
  }

  /**
   * Updates component text content based on current language and selected tooth
   */
  private updateTexts(): void {
    this.titleText = `${this.getTranslation('title')} #${this.selectedTooth}`;
  }

  constructor(private diagnosisService: DiagnosisService) {}

  /**
   * Object tracking the current status/condition of the selected tooth
   */
  toothStatus = {
    rootCanal: false,
    hasFilling: false,
    hasCrown: false,
    isLoose: false,
    noneOfTheAbove: false,
  };

  rootCanalSince: 'less' | 'more' | null = null;
  rootCanalFinished: boolean | null = null;

  fillingDeep: boolean | null = null;
  fillingBroken: boolean | null = null;

  crownFell: boolean | null = null;
  crownBroken: boolean | null = null;

  mobilityGrade: 1 | 2 | 3 | null = null;
  painWithLooseTooth: boolean | null = null;

  painOnBiting: boolean | null = null;

  /**
   * Handles changes to root canal treatment status
   * Manages dependencies between root canal completion and other treatments
   */
  onRootCanalStatusChange(): void {
    if (this.toothStatus.rootCanal && this.rootCanalFinished === false) {
      this.toothStatus.hasFilling = false;
      this.toothStatus.hasCrown = false;
    }
  }

  /**
   * Handles changes to tooth status checkboxes
   * Manages mutual exclusivity and logical dependencies between different status options
   * @param changedStatus The specific status option that was changed
   */
  onStatusChange(changedStatus: 'a' | 'b' | 'c' | 'd' | 'e'): void {
    if (changedStatus === 'd' && this.toothStatus.noneOfTheAbove) {
      this.toothStatus.rootCanal = false;
      this.toothStatus.hasFilling = false;
      this.toothStatus.hasCrown = false;
      this.toothStatus.isLoose = false;
      this.mobilityGrade = null;
    } else if (changedStatus === 'e' && this.toothStatus.isLoose) {
      this.toothStatus.rootCanal = false;
      this.toothStatus.hasFilling = false;
      this.toothStatus.hasCrown = false;
      this.toothStatus.noneOfTheAbove = false;
    } else if (['a', 'b', 'c'].includes(changedStatus)) {
      if (
        this.toothStatus.rootCanal ||
        this.toothStatus.hasFilling ||
        this.toothStatus.hasCrown
      ) {
        this.toothStatus.noneOfTheAbove = false;
        this.toothStatus.isLoose = false;
        this.mobilityGrade = null;
      }
    }

    if (!this.toothStatus.isLoose) {
      this.mobilityGrade = null;
      this.painWithLooseTooth = null;
    }

    if (this.toothStatus.rootCanal && this.toothStatus.hasFilling) {
      this.rootCanalFinished = true;
    }
  }

  /**
   * Validates that all relevant form questions have been answered
   * @returns True if form is complete and valid for submission
   */
  isFormValid(): boolean {
    let isValid = true;

    if (
      !this.toothStatus.noneOfTheAbove &&
      !this.toothStatus.rootCanal &&
      !this.toothStatus.hasFilling &&
      !this.toothStatus.hasCrown &&
      !this.toothStatus.isLoose
    ) {
      return false;
    }

    if (this.toothStatus.noneOfTheAbove) {
      return true;
    }

    if (this.toothStatus.isLoose) {
      if (this.isWisdomTooth) {
        return true;
      }
      if (this.painWithLooseTooth === null) {
        isValid = false;
      } else if (
        this.painWithLooseTooth === false &&
        this.mobilityGrade === null
      ) {
        isValid = false;
      }
      return isValid;
    }

    if (this.toothStatus.rootCanal) {
      if (this.rootCanalFinished === null) {
        isValid = false;
      }
      else if (this.rootCanalFinished === true && this.painOnBiting === null) {
        isValid = false;
      }
    }

    const isFillingSkipped =
      this.toothStatus.rootCanal && this.rootCanalFinished === true;
    if (this.toothStatus.hasFilling && !isFillingSkipped) {
      if (this.fillingDeep === null || this.fillingBroken === null) {
        isValid = false;
      }
    }

    if (this.toothStatus.hasCrown) {
      if (this.crownBroken === null) {
        isValid = false;
      }
      else if (this.crownBroken === false && this.crownFell === null) {
        isValid = false;
      }
    }

    return isValid;
  }
  
  /**
   * Processes the current tooth status and generates appropriate diagnosis
   * Handles different diagnostic paths based on tooth condition and symptoms
   */
  explainDiagnosis() {
    if (this.toothStatus.noneOfTheAbove) {
      this.flowCompletedWithoutDiagnosis.emit();
      return;
    }

    if (!this.isFormValid()) {
      return;
    }

    if (this.toothStatus.isLoose && this.isWisdomTooth) {
      this.emitDiagnosisById('weisheitszahnziehen');
      return;
    }

    if (this.toothStatus.isLoose) {
      if (this.painWithLooseTooth === true) {
        this.emitDiagnosisById('loose_tooth_with_pain_extraction');
        return;
      }

      if (this.painWithLooseTooth === false)
        switch (this.mobilityGrade) {
          case 1:
            this.emitDiagnosisById('mobility_grade_1');
            break;
          case 2:
            this.emitDiagnosisById('mobility_grade_2');
            break;
          case 3:
            this.emitDiagnosisById('mobility_grade_3');
            break;
        }
      return;
    }

    const foundDiagnosisIds: string[] = [];

    if (this.toothStatus.hasCrown) {
      if (this.crownBroken === true) {
        foundDiagnosisIds.push('crownBroken');
      } else if (this.crownFell === true) {
        foundDiagnosisIds.push('crownFell');
      }
    }

    if (this.toothStatus.rootCanal) {
      if (this.rootCanalFinished === false) {
        foundDiagnosisIds.push('rootCanalNotFinished');
      } else if (this.rootCanalFinished === true) {
        if (this.painOnBiting === true) {
          foundDiagnosisIds.push('rctFinishedStillPain');
        }
      }
    }

    const isFillingSkippedByRCT =
      this.toothStatus.rootCanal && this.rootCanalFinished === true;
    if (this.toothStatus.hasFilling && !isFillingSkippedByRCT) {
      if (this.fillingDeep === true) foundDiagnosisIds.push('deepFilling');
      if (this.fillingBroken === true) foundDiagnosisIds.push('fillingBroken');
    }

    if (foundDiagnosisIds.length > 0) {
      if (foundDiagnosisIds.length === 1) {
        this.emitDiagnosisById(foundDiagnosisIds[0]);
      } else {
        const combinedDiagnosis = this.combineDiagnoses(
          foundDiagnosisIds,
          'and'
        );
        this.diagnosisReady.emit(combinedDiagnosis);
      }
      return;
    }

    if (
      this.toothStatus.rootCanal &&
      this.rootCanalFinished === true &&
      this.painOnBiting === false
    ) {
      const combinedDiagnosis = this.combineDiagnoses(
        ['rctFinishedStillPain', 'septal_syndrome'],
        'or'
      );
      this.diagnosisReady.emit(combinedDiagnosis);
      return;
    }

    if (foundDiagnosisIds.length === 0) {
      this.flowCompletedWithoutDiagnosis.emit();
    }
  }

  /**
   * Emits a diagnosis event based on the provided diagnosis ID
   * @param id The diagnosis identifier to look up and emit
   */
  private emitDiagnosisById(id: string): void {
    const diagnosis = this.diagnosisService.getDiagnosisById(id);
    if (diagnosis) {
      this.diagnosisReady.emit(diagnosis);
    }
  }

  /**
   * Combines multiple diagnoses into a single comprehensive diagnosis object
   * Supports both "and" and "or" logical combinations with multilingual content
   * @param diagnosisIds Array of diagnosis IDs to combine
   * @param conjunction The logical connector ("and" or "or")
   * @returns Combined diagnosis object with multilingual content
   */
  private combineDiagnoses(
    diagnosisIds: string[],
    conjunction: 'and' | 'or'
  ): Diagnosis {
    const diagnoses: Diagnosis[] = diagnosisIds
      .map((id) => this.diagnosisService.getDiagnosisById(id))
      .filter((d): d is Diagnosis => !!d);

    if (diagnoses.length === 0) {
      return {
        id: 'multiple_empty',
        title: {
          en: '',
          fr: '',
          ar: '',
          de: '',
        },
        explanation: {
          en: '',
          fr: '',
          ar: '',
          de: '',
        },
        treatment: {
          en: '',
          fr: '',
          ar: '',
          de: '',
        },
      };
    }

    const combinedDiagnosis: Diagnosis = {
      id: 'multiple_issues',
      title: {
        en: '',
        fr: '',
        ar: '',
        de: '',
      },
      explanation: {
        en: '',
        fr: '',
        ar: '',
        de: '',
      },
      treatment: {
        en: '',
        fr: '',
        ar: '',
        de: '',
      },
    };

    const languages: Language[] = ['en', 'fr', 'de', 'ar'];

    const isOrLogic = conjunction === 'or';
    const titleKey = isOrLogic
      ? 'possibleDiagnosesTitle'
      : 'multipleIssuesTitle';
    const explanationIntroKey = isOrLogic
      ? 'possibleDiagnosesExplanationIntro'
      : 'multipleIssuesExplanationIntro';
    const treatmentIntroKey = isOrLogic
      ? 'possibleDiagnosesTreatmentIntro'
      : 'multipleIssuesTreatmentIntro';
    const conjunctionKey = isOrLogic ? 'orWord' : 'andWord';

    for (const lang of languages) {
      combinedDiagnosis.title[lang] = this.allTexts[titleKey][lang];
      const conjunctionWord = this.allTexts[conjunctionKey][lang];

      combinedDiagnosis.explanation[lang] =
        this.allTexts[explanationIntroKey][lang] +
        '\n\n' +
        diagnoses
          .map(
            (d, index) =>
              `${index + 1}. ${d.title[lang]}:\n${d.explanation[lang]}`
          )
          .join(`\n\n${conjunctionWord.toLocaleUpperCase()}\n\n`);

      combinedDiagnosis.treatment[lang] =
        this.allTexts[treatmentIntroKey][lang] +
        '\n\n' +
        diagnoses
          .map((d, index) => `${index + 1}. ${d.treatment[lang]}`)
          .join(`\n\n${conjunctionWord.toLocaleUpperCase()}\n\n`);
    }

    return combinedDiagnosis;
  }

  /**
   * Retrieves translated text for a given key in the current language
   * @param key The translation key to look up
   * @returns The translated text or a missing key indicator
   */
  public getTranslation(key: string): string {
    return this.allTexts[key]?.[this.language] ?? `Missing: ${key}`;
  }
}
