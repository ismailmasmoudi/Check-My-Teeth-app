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

type Language = 'en' | 'fr' | 'de' | 'ar';

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

  // --- Translation Dictionary ---
  // Moved here for efficiency. It's created only once per component instance.
  private readonly allTexts: Record<string, Record<Language, string>> = {
    // Template Texts
    title: {
      en: 'Status for tooth',
      fr: 'Statut pour la dent',
      de: 'Status für Zahn',
      ar: 'حالة السن',
    },
    rootCanal: {
      en: 'Root canal treated',
      fr: 'Traité par canal radiculaire',
      de: 'Wurzelkanalbehandelt',
      ar: 'معالج بقناة الجذر',
    },
    hasFilling: {
      en: 'Does it already have a definitive filling?',
      fr: 'A-t-elle déjà une obturation définitive ?',
      de: 'Hat bereits eine definitive Füllung',
      ar: 'هل بها حشوة دائمة بالفعل؟',
    },
    hasCrown: {
      en: 'Has crown',
      fr: 'A une couronne',
      de: 'Hat eine Krone',
      ar: 'لديه تاج',
    },
    isLoose: {
      en: 'Tooth is loose',
      fr: 'La dent est mobile',
      de: 'Zahn ist locker',
      ar: 'السن متحرك',
    },
    howLongAgo: {
      en: 'How long ago?',
      fr: 'Il y a combien de temps ?',
      de: 'Wie lange ist das her?',
      ar: 'منذ متى؟',
    },
    lessThan3Months: {
      en: 'Less than 3 months',
      fr: 'Moins de 3 mois',
      de: 'Weniger als 3 Monate',
      ar: 'أقل من 3 أشهر',
    },
    moreThan3Months: {
      en: 'More than 3 months',
      fr: 'Plus de 3 mois',
      de: 'Mehr als 3 Monate',
      ar: 'أكثر من 3 أشهر',
    },
    isFullyCompleted: {
      en: 'Is root canal fully completed (with filling)?',
      fr: 'Le traitement de canal est-il entièrement terminé (avec obturation) ?',
      de: 'Ist die Wurzelkanalbehandlung vollständig abgeschlossen (mit Füllung)?',
      ar: 'هل اكتمل علاج قناة الجذر بالكامل (مع الحشوة)؟',
    },
    wasFillingDeep: {
      en: 'Was the filling deep?',
      fr: "L'obturation était-elle profonde ?",
      de: 'War die Füllung tief?',
      ar: 'هل كانت الحشوة عميقة؟',
    },
    isFillingBroken: {
      en: 'Is the filling broken?',
      fr: "L'obturation est-elle cassée ?",
      de: 'Ist die Füllung abgebrochen?',
      ar: 'هل الحشوة مكسورة؟',
    },
    didCrownFallOff: {
      en: 'Did the crown fall off?',
      fr: 'La couronne est-elle tombée ?',
      de: 'Ist die Krone herausgefallen?',
      ar: 'هل سقط التاج؟',
    },
    isCrownBroken: {
      en: 'Is the crown broken?',
      fr: 'La couronne est-elle cassée ?',
      de: 'Ist die Krone gebrochen?',
      ar: 'هل التاج مكسور؟',
    },
    mobilityGradeQuestion: {
      en: 'What is the grade of mobility (1-3)?',
      fr: 'Quel est le degré de mobilité (1-3) ?',
      de: 'Welchen Lockerungsgrad hat der Zahn (1-3)?',
      ar: 'ما هي درجة حركة السن (1-3)؟',
    },
    grade1: {
      en: 'Grade 1 (slight movement)',
      fr: 'Grade 1 (mouvement léger)',
      de: 'Grad 1 (leichte Bewegung)',
      ar: 'درجة 1 (حركة طفيفة)',
    },
    grade2: {
      en: 'Grade 2 (moderate movement)',
      fr: 'Grade 2 (mouvement modéré)',
      de: 'Grad 2 (mäßige Bewegung)',
      ar: 'درجة 2 (حركة متوسطة)',
    },
    grade3: {
      en: 'Grade 3 (severe movement)',
      fr: 'Grade 3 (mouvement sévère)',
      de: 'Grad 3 (starke Bewegung)',
      ar: 'درجة 3 (حركة شديدة)',
    },
    yes: { en: 'Yes', fr: 'Oui', de: 'Ja', ar: 'نعم' },
    no: { en: 'No', fr: 'Non', de: 'Nein', ar: 'لا' },
    showDiagnosis: {
      en: 'Continue / Show Diagnosis',
      fr: 'Continuer / Afficher le diagnostic',
      de: 'Weiter / Diagnose anzeigen',
      ar: 'متابعة / إظهار التشخيص',
    },
    continueButton: {
      en: 'Continue',
      fr: 'Continuer',
      de: 'Weiter',
      ar: 'متابعة',
    },
    noneOfTheAbove: {
      en: 'The tooth has none of these options',
      fr: "La dent n'a aucune de ces options",
      de: 'Der Zahn hat keine dieser Optionen',
      ar: 'السن ليس به أي من هذه الخيارات',
    },
    painOnBitingQuestion: {
      en: 'Does it hurt when biting?',
      fr: 'Est-ce que ça fait mal en mordant ?',
      de: 'Tut es weh beim Beißen?',
      ar: 'هل يؤلم عند العض؟',
    },
    painWithLooseToothQuestion: {
      en: 'Do you have pain?',
      fr: 'Avez-vous des douleurs ?',
      de: 'Haben Sie Schmerzen?',
      ar: 'هل تشعر بألم؟',
    },
    andWord: { en: 'and', fr: 'et', de: 'und', ar: 'و' },
    orWord: { en: 'or', fr: 'ou', de: 'oder', ar: 'أو' },
    possibleDiagnosesTitle: {
      en: 'Possible Diagnoses',
      fr: 'Diagnostics Possibles',
      de: 'Mögliche Diagnosen',
      ar: 'تشخيصات محتملة',
    },
    multipleIssuesTitle: {
      en: 'Multiple Issues Found',
      fr: 'Plusieurs problèmes détectés',
      de: 'Mehrere Probleme festgestellt',
      ar: 'تم العثور على مشاكل متعددة',
    },
    multipleIssuesExplanationIntro: {
      en: 'This tooth presents with the following issues:',
      fr: 'Cette dent présente les problèmes suivants :',
      de: 'Dieser Zahn weist folgende Probleme auf:',
      ar: 'هذا السن يعاني من المشاكل التالية:',
    },
    possibleDiagnosesExplanationIntro: {
      en: 'The problem could be one of the following:',
      fr: "Le problème pourrait être l'un des suivants :",
      de: 'Das Problem könnte eine der folgenden Ursachen haben:',
      ar: 'قد تكون المشكلة واحدة مما يلي:',
    },
    multipleIssuesTreatmentIntro: {
      en: 'The recommended treatment plan is as follows:',
      fr: 'Le plan de traitement recommandé est le suivant :',
      de: 'Der empfohlene Behandlungsplan ist wie folgt:',
      ar: 'خطة العلاج الموصى بها هي كما يلي:',
    },
    possibleDiagnosesTreatmentIntro: {
      en: 'Depending on the diagnosis, the treatment could be one of the following:',
      fr: "Selon le diagnostic, le traitement pourrait être l'un des suivants :",
      de: 'Abhängig von der Diagnose könnte die Behandlung eine der folgenden sein:',
      ar: 'بناءً على التشخيص، قد يكون العلاج أحد الخيارات التالية:',
    },
  };

  // --- Multilingual Texts ---
  titleText: string = '';

  // New properties for wisdom tooth logic
  isWisdomTooth = false;
  private readonly wisdomTeeth = [18, 28, 38, 48];

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

  private updateTexts(): void {
    this.titleText = `${this.getTranslation('title')} #${this.selectedTooth}`;
  }

  constructor(private diagnosisService: DiagnosisService) {}

  // Tooth status checkboxes
  toothStatus = {
    rootCanal: false,
    hasFilling: false,
    hasCrown: false,
    isLoose: false,
    noneOfTheAbove: false,
  };

  // Root canal questions
  rootCanalSince: 'less' | 'more' | null = null;
  rootCanalFinished: boolean | null = null;

  // Filling questions
  fillingDeep: boolean | null = null;
  fillingBroken: boolean | null = null;

  // Crown questions
  crownFell: boolean | null = null;
  crownBroken: boolean | null = null;

  // Loose tooth question
  mobilityGrade: 1 | 2 | 3 | null = null;
  painWithLooseTooth: boolean | null = null;

  // New question A3
  painOnBiting: boolean | null = null;

  onRootCanalStatusChange(): void {
    // If root canal is checked AND it's explicitly marked as NOT completed (false),
    // then disable and uncheck filling/crown options.
    if (this.toothStatus.rootCanal && this.rootCanalFinished === false) {
      this.toothStatus.hasFilling = false;
      this.toothStatus.hasCrown = false;
    }
  }

  onStatusChange(changedStatus: 'a' | 'b' | 'c' | 'd' | 'e'): void {
    if (changedStatus === 'd' && this.toothStatus.noneOfTheAbove) {
      // If "none" is checked, uncheck others
      this.toothStatus.rootCanal = false;
      this.toothStatus.hasFilling = false;
      this.toothStatus.hasCrown = false;
      this.toothStatus.isLoose = false;
      this.mobilityGrade = null; // Reset grade
    } else if (changedStatus === 'e' && this.toothStatus.isLoose) {
      // If "isLoose" is checked, uncheck others
      this.toothStatus.rootCanal = false;
      this.toothStatus.hasFilling = false;
      this.toothStatus.hasCrown = false;
      this.toothStatus.noneOfTheAbove = false;
    } else if (['a', 'b', 'c'].includes(changedStatus)) {
      // If any of a, b, or c is checked, uncheck "none" and "isLoose"
      if (
        this.toothStatus.rootCanal ||
        this.toothStatus.hasFilling ||
        this.toothStatus.hasCrown
      ) {
        this.toothStatus.noneOfTheAbove = false;
        this.toothStatus.isLoose = false;
        this.mobilityGrade = null; // Reset grade
      }
    }

    // If isLoose is unchecked manually, reset its question
    if (!this.toothStatus.isLoose) {
      this.mobilityGrade = null;
      this.painWithLooseTooth = null;
    }

    // New Logic: If 'a' and 'b' are selected, automatically set A2 to 'Yes'
    if (this.toothStatus.rootCanal && this.toothStatus.hasFilling) {
      this.rootCanalFinished = true;
    }
  }

  // New method to check if all relevant questions are answered
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

    // If "none of the above" is selected, the form is valid to proceed.
    if (this.toothStatus.noneOfTheAbove) {
      return true;
    }

    // Validate Loose Tooth question if selected
    if (this.toothStatus.isLoose) {
      // Special case for wisdom teeth: no further questions needed
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

    // Validate Root Canal questions if selected
    if (this.toothStatus.rootCanal) {
      // Q2 (isFullyCompleted) must always be answered
      if (this.rootCanalFinished === null) {
        isValid = false;
      }
      // If Q2 is 'Yes', then Q3 (painOnBiting) must be answered
      else if (this.rootCanalFinished === true && this.painOnBiting === null) {
        isValid = false;
      }
    }

    // Validate Filling questions if selected and not skipped by a finished root canal
    const isFillingSkipped =
      this.toothStatus.rootCanal && this.rootCanalFinished === true;
    if (this.toothStatus.hasFilling && !isFillingSkipped) {
      if (this.fillingDeep === null || this.fillingBroken === null) {
        isValid = false;
      }
    }

    // Validate Crown questions if selected
    if (this.toothStatus.hasCrown) {
      // First question must always be answered
      if (this.crownBroken === null) {
        isValid = false;
      }
      // Second question is only required if the first answer was 'No'
      else if (this.crownBroken === false && this.crownFell === null) {
        isValid = false;
      }
    }

    return isValid;
  }
  explainDiagnosis() {
    // If "none of the above" is selected, go straight to pain questions.
    if (this.toothStatus.noneOfTheAbove) {
      this.flowCompletedWithoutDiagnosis.emit();
      return;
    }

    if (!this.isFormValid()) {
      console.warn('Form is not valid. Cannot explain diagnosis.');
      return;
    }

    // Special case for loose wisdom teeth
    if (this.toothStatus.isLoose && this.isWisdomTooth) {
      this.emitDiagnosisById('weisheitszahnziehen');
      return;
    }

    // Evaluation for Loose Tooth (Highest Priority)
    if (this.toothStatus.isLoose) {
      if (this.painWithLooseTooth === true) {
        this.emitDiagnosisById('loose_tooth_with_pain_extraction');
        return;
      }

      // Only evaluate grade if there is no pain
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
      return; // Definitive diagnosis, stop here.
    }

    const foundDiagnosisIds: string[] = [];

    // --- Collect all concurrent diagnoses ---

    // 1. Evaluate Crown Issues
    if (this.toothStatus.hasCrown) {
      if (this.crownBroken === true) {
        foundDiagnosisIds.push('crownBroken');
      } else if (this.crownFell === true) {
        // This implies crownBroken is false from the UI logic
        foundDiagnosisIds.push('crownFell');
      }
    }

    // 2. Evaluate Root Canal Issues
    if (this.toothStatus.rootCanal) {
      if (this.rootCanalFinished === false) {
        foundDiagnosisIds.push('rootCanalNotFinished');
      } else if (this.rootCanalFinished === true) {
        if (this.painOnBiting === true) {
          foundDiagnosisIds.push('rctFinishedStillPain');
        }
        // The "OR" case (painOnBiting === false) is handled later if no other issues are found.
      }
    }

    // 3. Evaluate Filling Issues
    const isFillingSkippedByRCT =
      this.toothStatus.rootCanal && this.rootCanalFinished === true;
    if (this.toothStatus.hasFilling && !isFillingSkippedByRCT) {
      if (this.fillingDeep === true) foundDiagnosisIds.push('deepFilling');
      if (this.fillingBroken === true) foundDiagnosisIds.push('fillingBroken');
    }

    // --- Process the collected diagnoses ---

    // If we have found one or more "AND" problems, process them.
    if (foundDiagnosisIds.length > 0) {
      if (foundDiagnosisIds.length === 1) {
        this.emitDiagnosisById(foundDiagnosisIds[0]);
      } else {
        const combinedDiagnosis = this.combineDiagnoses(foundDiagnosisIds, 'and');
        this.diagnosisReady.emit(combinedDiagnosis);
      }
      return; // We are done.
    }

    // If no "AND" problems were found, check for the special "OR" case from RCT.
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

    // If we reach here, it means no specific diagnosis was found (e.g., crown is fine).
    // We should proceed to the general pain questions.
    if (foundDiagnosisIds.length === 0) {
      this.flowCompletedWithoutDiagnosis.emit();
    }
  }

  private emitDiagnosisById(id: string): void {
    const diagnosis = this.diagnosisService.getDiagnosisById(id);
    if (diagnosis) {
      // Emit the entire diagnosis object, not just the translated strings
      this.diagnosisReady.emit(diagnosis);
    }
  }

  private combineDiagnoses(
    diagnosisIds: string[],
    conjunction: 'and' | 'or'
  ): Diagnosis {
    const diagnoses: Diagnosis[] = diagnosisIds
      .map((id) => this.diagnosisService.getDiagnosisById(id))
      .filter((d): d is Diagnosis => !!d);

    if (diagnoses.length === 0) {
      // Return an empty Diagnosis object to avoid errors
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

    // Create a new Diagnosis object to hold the combined, multilingual texts
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

    // Loop through each language to build the combined texts for that language
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

  // This method is now public so it can be accessed by the template.
  public getTranslation(key: string): string {
    return this.allTexts[key]?.[this.language] ?? `Missing: ${key}`;
  }
}
