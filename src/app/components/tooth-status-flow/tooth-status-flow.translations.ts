type Language = 'en' | 'fr' | 'de' | 'ar';

/**
 * Translation dictionary for the tooth status flow component
 * Contains all multilingual text content organized by key with translations for each supported language
 */
export const toothStatusFlowTexts: Record<string, Record<Language, string>> = {
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
