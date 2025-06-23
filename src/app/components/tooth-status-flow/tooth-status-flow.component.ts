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

type Language = 'en' | 'fr' | 'de' | 'ar';

@Component({
  selector: 'app-tooth-status-flow',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tooth-status-flow.component.html',
  styleUrls: ['./tooth-status-flow.component.scss'],
})
export class ToothStatusFlowComponent implements OnChanges {
  @Input() selectedTooth: string = '';
  @Input() language: Language = 'en';
  @Output() diagnosisReady = new EventEmitter<{
    title: string;
    explanation: string;
    treatment: string;
  }>();
  @Output() flowCompletedWithoutDiagnosis = new EventEmitter<void>();

  // --- Translation Dictionary ---
  // Moved here for efficiency. It's created only once per component instance.
  private readonly allTexts: Record<string, Record<string, string>> = {
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
      en: 'Already has filling',
      fr: 'A déjà une obturation',
      de: 'Hat bereits eine Füllung',
      ar: 'لديه حشوة بالفعل',
    },
    hasCrown: {
      en: 'Has crown',
      fr: 'A une couronne',
      de: 'Hat eine Krone',
      ar: 'لديه تاج',
    },
    howLongAgo: {
      en: '1. How long ago?',
      fr: '1. Il y a combien de temps ?',
      de: '1. Wie lange ist das her?',
      ar: '1. منذ متى؟',
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
      en: '2. Is root canal fully completed (with filling)?',
      fr: '2. Le traitement de canal est-il entièrement terminé (avec obturation) ?',
      de: '2. Ist die Wurzelkanalbehandlung vollständig abgeschlossen (mit Füllung)?',
      ar: '2. هل اكتمل علاج قناة الجذر بالكامل (مع الحشوة)؟',
    },
    wasFillingDeep: {
      en: '1. Was the filling deep?',
      fr: "1. L'obturation était-elle profonde ?",
      de: '1. War die Füllung tief?',
      ar: '1. هل كانت الحشوة عميقة؟',
    },
    isFillingBroken: {
      en: '2. Is the filling broken?',
      fr: "2. L'obturation est-elle cassée ?",
      de: '2. Ist die Füllung abgebrochen?',
      ar: '2. هل الحشوة مكسورة؟',
    },
    didCrownFallOff: {
      en: '1. Did the crown fall off?',
      fr: '1. La couronne est-elle tombée ?',
      de: '1. Ist die Krone herausgefallen?',
      ar: '1. هل سقط التاج؟',
    },
    isCrownBroken: {
      en: '2. Is the crown broken?',
      fr: '2. La couronne est-elle cassée ?',
      de: '2. Ist die Krone gebrochen?',
      ar: '2. Ist die Krone gebrochen?',
    },
    yes: { en: 'Yes', fr: 'Oui', de: 'Ja', ar: 'نعم' },
    no: { en: 'No', fr: 'Non', de: 'Nein', ar: 'لا' },
    showDiagnosis: {
      en: 'Continue / Show Diagnosis',
      fr: 'Continuer / Afficher le diagnostic',
      de: 'Weiter / Diagnose anzeigen',
      ar: 'متابعة / إظهار التشخيص',
    },

    // Diagnosis Titles
    'title.rootCanalNotFinished': {
      en: 'Incomplete Root Canal',
      de: 'Unvollständige Wurzelbehandlung',
      fr: 'Traitement de canal incomplet',
      ar: 'علاج عصب غير مكتمل',
    },
    'title.deepFilling': {
      en: 'Possible Irreversible Pulpitis',
      de: 'Mögliche irreversible Pulpitis',
      fr: 'Pulpite irréversible possible',
      ar: 'التهاب لب السن اللاعكوس المحتمل',
    },
    'title.fillingBroken': {
      en: 'Broken Filling',
      de: 'Defekte Füllung',
      fr: 'Obturation cassée',
      ar: 'حشوة مكسورة',
    },
    'title.crownFell': {
      en: 'Crown Fell Off',
      de: 'Krone herausgefallen',
      fr: 'Couronne tombée',
      ar: 'سقوط التاج',
    },
    'title.brokenCrown': {
      en: 'Broken Crown',
      de: 'Krone gebrochen',
      fr: 'Couronne cassée',
      ar: 'تاج مكسور',
    },
    'title.rctFinishedStillPain': {
      en: 'Root Canal Treated Tooth with Persistent Issues',
      fr: 'Dent traitée par canal avec problèmes persistants',
      de: 'Wurzelkanalbehandelter Zahn mit anhaltenden Problemen',
      ar: 'سن معالج بقناة الجذر بمشاكل مستمرة',
    },
    'title.multipleIssues': {
      en: 'Multiple Issues Found',
      fr: 'Plusieurs problèmes détectés',
      de: 'Mehrere Probleme festgestellt',
      ar: 'تم العثور على مشاكل متعددة',
    },
    andWord: { en: 'and', fr: 'et', de: 'und', ar: 'و' },

    // Diagnosis Explanations
    'explanation.rootCanalNotFinished': {
      en: 'The root canal treatment is not yet completed. The tooth canals are likely still infected.',
      de: 'Die Wurzelkanalbehandlung ist noch nicht abgeschlossen. Die Wurzelkanäle sind wahrscheinlich entzündet.',
      fr: 'Le traitement de canal n’est pas terminé. Les canaux sont probablement encore infectés.',
      ar: 'لم يكتمل علاج العصب بعد. من المحتمل أن تكون القنوات لا تزال ملتهبة.',
    },
    'explanation.deepFilling': {
      en: 'A deep filling is close to the nerve, which may cause inflammation (pulpitis).',
      de: 'Eine tiefe Füllung liegt nahe am Nerv, was eine Entzündung (Pulpitis) verursachen kann.',
      fr: 'Une obturation profonde est proche du nerf, ce qui peut provoquer une inflammation (pulpite).',
      ar: 'الحشوة العميقة قريبة من العصب، مما قد يسبب التهابًا (التهاب العصب).',
    },
    'explanation.fillingBroken': {
      en: 'The filling is broken, which can lead to new decay or sensitivity.',
      de: 'Die Füllung ist abgebrochen, was zu neuer Karies oder Empfindlichkeit führen kann.',
      fr: 'La restauration est cassée, ce qui peut entraîner une nouvelle carie ou une sensibilité.',
      ar: 'الحشوة مكسورة، مما قد يؤدي إلى تسوس جديد أو حساسية.',
    },
    'explanation.crownFell': {
      en: 'The crown has fallen off, exposing the underlying tooth structure.',
      de: 'Die Krone ist herausgefallen und legt die darunterliegende Zahnstruktur frei.',
      fr: 'La couronne est tombée, exposant la structure dentaire sous-jacente.',
      ar: 'سقط التاج، مما يكشف عن بنية السن الأساسية.',
    },
    'explanation.brokenCrown': {
      en: 'The crown is broken, which can have sharp edges and no longer protects the tooth.',
      de: 'Die Krone ist beschädigt, was scharfe Kanten haben kann und den Zahn nicht mehr schützt.',
      fr: 'La couronne est cassée, ce qui peut présenter des bords tranchants et ne protège plus la dent.',
      ar: 'التاج مكسور، مما قد يكون له حواف حادة ولم يعد يحمي السن.',
    },
    'explanation.rctFinishedStillPain': {
      en: 'Despite completed root canal treatment, the tooth still presents issues, possibly indicating a need for retreatment or extraction.',
      fr: "Malgré un traitement de canal terminé, la dent présente toujours des problèmes, indiquant peut-être un besoin de retraitement ou d'extraction.",
      de: 'Trotz abgeschlossener Wurzelkanalbehandlung weist der Zahn weiterhin Probleme auf, was möglicherweise auf die Notwendigkeit einer Revision oder Extraktion hindeutet.',
      ar: 'على الرغم من اكتمال علاج قناة الجذر، لا يزال السن يعاني من مشاكل، مما قد يشير إلى الحاجة إلى إعادة العلاج أو الخلع.',
    },

    'explanation.multipleIssuesIntro': {
      en: 'This tooth presents with the following issues:',
      fr: 'Cette dent présente les problèmes suivants :',
      de: 'Dieser Zahn weist folgende Probleme auf:',
      ar: 'هذا السن يعاني من المشاكل التالية:',
    },
    // Diagnosis Treatments
    'treatment.rootCanalNotFinished': {
      en: 'Must finish the root canal treatment as soon as possible. Might need antibiotics – but only after seeing a dentist. Never take antibiotics alone without diagnosis.',
      de: 'Die Wurzelkanalbehandlung muss so schnell wie möglich abgeschlossen werden. Möglicherweise sind Antibiotika erforderlich – aber nur nach einem Zahnarztbesuch. Nehmen Sie niemals Antibiotika ohne Diagnose ein.',
      fr: "Il faut terminer le traitement de canal dès que possible. Des antibiotiques peuvent être nécessaires, mais seulement après avoir vu un dentiste. Ne prenez jamais d'antibiotiques seul sans diagnostic.",
      ar: 'يجب إنهاء علاج قناة الجذر في أسرع وقت ممكن. قد تحتاج إلى مضادات حيوية - ولكن فقط بعد زيارة طبيب الأسنان. لا تتناول المضادات الحيوية بمفردك أبدًا بدون تشخيص.',
    },
    'treatment.deepFilling': {
      en: 'A root canal treatment is likely necessary to save the tooth.',
      de: 'Eine Wurzelkanalbehandlung ist wahrscheinlich notwendig, um den Zahn zu retten.',
      fr: 'Un traitement de canal est probablement nécessaire pour sauver la dent.',
      ar: 'من المرجح أن يكون علاج قناة الجذر ضروريًا لإنقاذ السن.',
    },
    'treatment.fillingBroken': {
      en: 'You need a new filling.',
      de: 'Sie benötigen eine neue Füllung.',
      fr: 'Vous avez besoin d’une nouvelle restauration.',
      ar: 'تحتاج إلى حشوة جديدة.',
    },
    'treatment.crownFell': {
      en: 'The crown must be reattached or replaced. Keep the crown and see a dentist.',
      de: 'Die Krone muss wieder befestigt oder ersetzt werden. Bewahren Sie die Krone auf und suchen Sie einen Zahnarzt auf.',
      fr: 'La couronne doit être recollée ou remplacée. Conservez la couronne et consultez un dentiste.',
      ar: 'يجب إعادة تثبيت التاج أو استبداله. احتفظ بالتاج وراجع طبيب الأسنان.',
    },
    'treatment.brokenCrown': {
      en: 'A new crown must be made.',
      de: 'Eine neue Krone muss angefertigt werden.',
      fr: 'Eine neue Krone doit être fabriquée.',
      ar: 'يجب عمل تاج جديد.',
    },
    'treatment.rctFinishedStillPain': {
      en: 'Antibiotics might be considered (only after dentist consultation), followed by root canal revision or tooth extraction.',
      fr: "Des antibiotiques peuvent être envisagés (uniquement après consultation dentaire), suivis d'une révision du canal radiculaire ou d'une extraction dentaire.",
      de: 'Antibiotika können in Betracht gezogen werden (nur nach Zahnarztkonsultation), gefolgt von einer Wurzelkanalrevision oder Zahnextraktion.',
      ar: 'قد يتم النظر في المضادات الحيوية (فقط بعد استشارة طبيب الأسنان)، يليها إعادة علاج قناة الجذر أو خلع السن.',
    },

    'treatment.multipleIssuesIntro': {
      en: 'The recommended treatment plan is as follows:',
      fr: 'Le plan de traitement recommandé est le suivant :',
      de: 'Der empfohlene Behandlungsplan ist wie folgt:',
      ar: 'خطة العلاج الموصى بها هي كما يلي:',
    },
  };

  // --- Multilingual Texts ---
  titleText: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['language'] || changes['selectedTooth']) {
      this.updateTexts();
    }
  }

  private updateTexts(): void {
    this.titleText = `${this.getTranslation('title')} #${this.selectedTooth}`;
  }

  // Tooth status checkboxes
  toothStatus = {
    rootCanal: false,
    hasFilling: false,
    hasCrown: false,
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

  onRootCanalStatusChange(): void {
    // If root canal is checked AND it's explicitly marked as NOT completed (false),
    // then disable and uncheck filling/crown options.
    if (this.toothStatus.rootCanal && this.rootCanalFinished === false) {
      this.toothStatus.hasFilling = false;
      this.toothStatus.hasCrown = false;
    }
  }

  // New method to check if all relevant questions are answered
  isFormValid(): boolean {
    let isValid = true;

    // At least one main status checkbox must be selected to proceed
    if (
      !this.toothStatus.rootCanal &&
      !this.toothStatus.hasFilling &&
      !this.toothStatus.hasCrown
    ) {
      return false;
    }

    // Validate Root Canal questions if selected
    if (this.toothStatus.rootCanal) {
      if (this.rootCanalSince === null || this.rootCanalFinished === null) {
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
      if (this.crownFell === null || this.crownBroken === null) {
        isValid = false;
      }
    }

    return isValid;
  }

  explainDiagnosis() {
    if (!this.isFormValid()) {
      // This case should ideally not be reached if the button is disabled,
      // but it's a good safeguard.
      console.warn('Form is not valid. Cannot explain diagnosis.');
      return;
    }

    const foundDiagnoses: {
      title: string;
      explanation: string;
      treatment: string;
    }[] = [];

    // Evaluation A: Root Canal Treated (Highest Priority)
    if (this.toothStatus.rootCanal) {
      // Case 1: Not Completed
      if (this.rootCanalFinished === false) {
        this.diagnosisReady.emit({
          title: this.getTranslation('title.rootCanalNotFinished'),
          explanation: this.getTranslation('explanation.rootCanalNotFinished'),
          treatment: this.getTranslation('treatment.rootCanalNotFinished'),
        });
        return; // Definitive diagnosis, stop here.
      }
      // Case 2: Completed but still issues (A1 answered AND A2 = "Yes")
      else if (
        this.rootCanalFinished === true &&
        this.rootCanalSince !== null
      ) {
        this.diagnosisReady.emit({
          title: this.getTranslation('title.rctFinishedStillPain'),
          explanation: this.getTranslation('explanation.rctFinishedStillPain'),
          treatment: this.getTranslation('treatment.rctFinishedStillPain'),
        });
        return; // Definitive diagnosis, stop here.
      }
    }

    // Evaluation C: Crown Issues (only if no direct RCT diagnosis was made)
    else if (this.toothStatus.hasCrown) {
      if (this.crownFell === true && this.crownBroken === false) {
        foundDiagnoses.push({
          title: this.getTranslation('title.crownFell'),
          explanation: this.getTranslation('explanation.crownFell'),
          treatment: this.getTranslation('treatment.crownFell'),
        });
      }
      // This covers both C1=Yes & C2=Yes, and C1=No & C2=Yes
      if (this.crownBroken === true) {
        foundDiagnoses.push({
          title: this.getTranslation('title.brokenCrown'),

          explanation: this.getTranslation('explanation.brokenCrown'),
          treatment: this.getTranslation('treatment.crownBroken'),
        });
      }
    }

    // Evaluation B: Filling Issues
    // This runs only if no direct RCT or Crown diagnosis was made, AND it's not skipped by a finished root canal.
    const isFillingSkippedByRCT =
      this.toothStatus.rootCanal && this.rootCanalFinished === true;
    if (this.toothStatus.hasFilling && !isFillingSkippedByRCT) {
      if (this.fillingDeep === true) {
        foundDiagnoses.push({
          title: this.getTranslation('title.deepFilling'),
          explanation: this.getTranslation('explanation.deepFilling'),
          treatment: this.getTranslation('treatment.deepFilling'),
        });
      }
      if (this.fillingBroken === true && this.fillingDeep === false) {
        // B2=Yes and B1=No
        foundDiagnoses.push({
          title: this.getTranslation('title.fillingBroken'),
          explanation: this.getTranslation('explanation.fillingBroken'),
          treatment: this.getTranslation('treatment.fillingBroken'),
        });
      }
    }

    // Now, process the collected diagnoses
    if (foundDiagnoses.length === 0) {
      // No direct diagnosis, signal to parent to continue to the next flow
      this.flowCompletedWithoutDiagnosis.emit();
    } else if (foundDiagnoses.length === 1) {
      // Only one issue found, emit it directly
      this.diagnosisReady.emit(foundDiagnoses[0]);
    } else {
      // Multiple issues found, combine them
      const combinedDiagnosis = this.combineDiagnoses(foundDiagnoses);
      this.diagnosisReady.emit(combinedDiagnosis);
    }
  }

  private combineDiagnoses(
    diagnoses: { title: string; explanation: string; treatment: string }[]
  ): { title: string; explanation: string; treatment: string } {
    const combinedTitle = this.getTranslation('title.multipleIssues');
    const andWord = this.getTranslation('andWord');

    const combinedExplanation =
      this.getTranslation('explanation.multipleIssuesIntro') +
      '\n\n' +
      diagnoses
        .map((d, index) => `${index + 1}. ${d.title}:\n${d.explanation}`)
        .join(`\n\n${andWord}\n\n`);
    const combinedTreatment =
      this.getTranslation('treatment.multipleIssuesIntro') +
      '\n\n' +
      diagnoses.map((d, index) => `${index + 1}. ${d.treatment}`).join(`\n\n${andWord}\n\n`);
    return {
      title: combinedTitle,
      explanation: combinedExplanation,
      treatment: combinedTreatment,
    };
  }

  // This method is now public so it can be accessed by the template.
  public getTranslation(key: string): string {
    return this.allTexts[key]?.[this.language] ?? `Missing: ${key}`;
  }
}
