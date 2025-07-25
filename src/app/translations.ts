export interface LanguageStrings {
  en: string;
  de: string;
  fr: string;
  ar: string;
}

export interface GreetingStrings {
  morning: LanguageStrings;
  afternoon: LanguageStrings;
  evening: LanguageStrings;
}

export interface PainTypeStrings {
  tooth: LanguageStrings;
  gum: LanguageStrings;
  tmj: LanguageStrings;
}

export interface PainType {
  value: string;
  label: LanguageStrings;
}

export const NAME_PROMPT_TEXT: LanguageStrings = {
  en: 'Hi there! Before we begin, may I kindly ask for your name?',
  de: 'Hallo! Bevor wir starten, darf ich bitte Ihren Namen wissen?',
  fr: 'Bonjour ! Avant de commencer, puis-je vous demander votre prénom ?',
  ar: 'مرحبًا! قبل أن نبدأ، هل لي أن أعرف اسمك من فضلك؟',
};

export const NAME_INPUT_PLACEHOLDER: LanguageStrings = {
  en: 'Your name',
  de: 'Ihr Name',
  fr: 'Votre nom',
  ar: 'اسمك',
};

export const CONTINUE_BUTTON_LABEL: LanguageStrings = {
  en: 'Continue',
  de: 'Weiter',
  fr: 'Continuer',
  ar: 'متابعة',
};

export const GREETINGS: GreetingStrings = {
  morning: {
    en: 'Good morning,',
    de: 'Guten Morgen,',
    fr: 'Bonjour,',
    ar: 'صباح الخير،',
  },
  afternoon: {
    en: 'Good afternoon,',
    de: 'Guten Tag,',
    fr: 'Bonjour,',
    ar: 'مساء الخير،',
  },
  evening: {
    en: 'Good evening,',
    de: 'Guten Abend,',
    fr: 'Bonsoir,',
    ar: 'مساء الخير،',
  },
};

export const PAIN_TYPE_QUESTION_TEXT: LanguageStrings = {
  en: 'What type of pain do you have?',
  fr: 'Quel type de douleur avez-vous ?',
  de: 'Welche Art von Schmerzen haben Sie?',
  ar: 'ما نوع الألم الذي تعاني منه؟',
};

export const SELECT_PAIN_TYPE_LABEL: LanguageStrings = {
  en: 'Select pain type',
  fr: 'Sélectionnez le type de douleur',
  de: 'Schmerzart auswählen',
  ar: 'اختر نوع الألم',
};

export const PAIN_TYPES_TEXT: PainTypeStrings = {
  tooth: {
    en: 'Tooth pain',
    fr: 'Douleur dentaire',
    de: 'Zahnschmerzen',
    ar: 'ألم الأسنان',
  },
  gum: {
    en: 'Gum pain',
    fr: 'Douleur des gencives',
    de: 'Zahnfleischschmerzen',
    ar: 'ألم اللثة',
  },
  tmj: {
    en: 'Jaw Joint Pain',
    fr: "Douleur à l'articulation de la mâchoire",
    de: 'Kiefergelenkschmerzen',
    ar: 'ألم في مفصل الفك',
  },
};

export const BACK_BUTTON_LABEL: LanguageStrings = {
  en: 'Back',
  fr: 'Retour',
  de: 'Zurück',
  ar: 'رجوع',
};

export const CLOSE_BUTTON_LABEL: LanguageStrings = {
  en: 'Close',
  fr: 'Fermer',
  de: 'Schließen',
  ar: 'إغلاق',
};

export const DIAGNOSIS_EXPLANATION_LABEL: { [key: string]: string } = {
  en: 'Explanation',
  fr: 'Explication',
  de: 'Erklärung',
  ar: 'شرح',
};

export const DIAGNOSIS_TREATMENT_LABEL: { [key: string]: string } = {
  en: 'Suggested Treatment',
  fr: 'Traitement Suggéré',
  de: 'Vorgeschlagene Behandlung',
  ar: 'العلاج المقترح',
};

export const START_OVER_BUTTON_LABEL: LanguageStrings = {
  en: 'Start Over',
  fr: 'Recommencer',
  de: 'Von vorne beginnen',
  ar: 'البدء من جديد',
};

export const DISCLAIMER_TEXT: LanguageStrings = {
  en: 'The diagnosis shown here is based on the information you have provided and is approximately 80 % accurate. However, a clinical examination in a dental practice is necessary for an exact diagnosis. If necessary, an X-ray should also be taken.',
  fr: 'Le diagnostic affiché ici est basé sur les informations que vous avez fournies et est correct à environ 80 %. Cependant, un examen clinique dans un cabinet dentaire est nécessaire pour un diagnostic exact. Si nécessaire, une radiographie doit également être réalisée.',
  de: 'Die hier angezeigte Diagnose basiert auf den von Ihnen angegebenen Informationen und ist mit einer Wahrscheinlichkeit von etwa 80 % korrekt. Für eine exakte Diagnose ist jedoch eine klinische Untersuchung in einer Zahnarztpraxis erforderlich. Falls notwendig, sollte zusätzlich ein Röntgenbild angefertigt werden.',
  ar: 'التشخيص المعروض هنا يعتمد على المعلومات التي قدمتها وهو صحيح بنسبة 80 % تقريبًا. ومع ذلك، فإن الفحص السريري في عيادة الأسنان ضروري لتشخيص دقيق. إذا لزم الأمر، يجب أيضًا إجراء صورة أشعة.',
};

export const PRIVACY_CONSENT_TEXT_PARTS: { [key: string]: string[] } = {
  en: [
    'I have read the ',
    ' and agree to the processing of my data as described therein.',
  ],
  de: [
    'Ich habe die ',
    ' gelesen und stimme der Verarbeitung meiner Daten wie dort beschrieben zu.',
  ],
  fr: [
    "J'ai lu la ",
    " et j'accepte le traitement de mes données tel qu'il y est décrit.",
  ],
  ar: ['لقد قرأت ', ' وأوافق على معالجة بياناتي كما هو موضح فيها.'],
};

export const PRIVACY_POLICY_LINK_TEXT: LanguageStrings = {
  en: 'privacy policy',
  de: 'Datenschutzerklärung',
  fr: 'politique de confidentialité',
  ar: 'سياسة الخصوصية',
};

export const IMPORTANT_NOTICE_TEXT: LanguageStrings = {
  en: 'Important:',
  de: 'Wichtig:',
  fr: 'Important :',
  ar: 'مهم:',
};

export const DIAGNOSING_TEXT: LanguageStrings = {
  en: 'Creating diagnosis...',
  de: 'Diagnose wird erstellt...',
  fr: 'Création du diagnostic...',
  ar: 'جاري إنشاء التشخيص...',
};

export const NAME_ERROR_TEXT: LanguageStrings = {
  de: 'Bitte geben Sie einen gültigen Namen ein. Zahlen und Sonderzeichen sind nicht erlaubt.',
  en: 'Please enter a valid name. Numbers and special characters are not allowed.',
  ar: 'يرجى إدخال اسم صحيح. الأرقام والرموز غير مسموح بها.',
  fr: 'Veuillez entrer un nom valide. Les chiffres et les caractères spéciaux ne sont pas autorisés.',
};

export const PAIN_TYPES: PainType[] = [
  {
    value: 'tooth',
    label: { de: 'Zahn', en: 'Tooth', fr: 'Dent', ar: 'سن' },
  },
  {
    value: 'gum',
    label: { de: 'Zahnfleisch', en: 'Gum', fr: 'Gencive', ar: 'لثة' },
  },
  {
    value: 'tmj',
    label: {
      de: 'Kiefergelenk',
      en: 'Jaw joint',
      fr: 'Articulation',
      ar: 'مفصل الفك',
    },
  },
];
