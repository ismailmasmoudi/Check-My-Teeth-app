import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type Language = 'en' | 'fr' | 'de' | 'ar';

@Component({
  selector: 'app-info-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-menu.component.html',
  styleUrls: ['./info-menu.component.scss'],
})
export class InfoMenuComponent {
  @Input() language: Language = 'en';
  isOpen = false;
  selectedPage: string | null = null;

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.selectedPage = null; // Close content when menu is closed
    }
  }

  openPage(page: string) {
    this.selectedPage = page;
    this.isOpen = false; // Close the menu after selecting a page
  }

  // --- Multilingual Texts ---
  menuItems = {
    imprint: { en: 'Imprint', fr: 'Mentions légales', de: 'Impressum', ar: 'بيانات الناشر' },
    privacy: { en: 'Privacy Policy', fr: 'Politique de confidentialité', de: 'Datenschutz', ar: 'سياسة الخصوصية' },
    disclaimer: { en: 'Disclaimer', fr: 'Avertissement', de: 'Haftungsausschluss', ar: 'إخلاء المسؤولية' },
    about: { en: 'About the App', fr: 'À propos de l\'application', de: 'Über die App', ar: 'عن التطبيق' },
  };

  imprintContent = {
    en: `
      <h2>Imprint</h2>
      <p>Information according to § 5 TMG:</p>
      <p>Ismail Masmoudi<br>
      Dentist (studied in Algeria, not practicing dentistry in Germany)<br>
      Private person - non-commercial project<br>
      Moosburger Straße 10A<br>
      80993 Munich<br>
      Germany</p>
      <p>Email: checkmytoothbot@gmail.com</p>
      <p>Responsible for content according to § 55 para. 2 RStV:<br>
      Ismail Masmoudi</p>
      <p>This app is a non-commercial, private project created out of personal motivation for health education.<br>
      It does not generate profit, contains no advertising, and is not used commercially.</p>
    `,
    fr: `
      <h2>Mentions légales</h2>
      <p>Informations conformément au § 5 TMG :</p>
      <p>Ismail Masmoudi<br>
      Chirurgien-dentiste (études en Algérie, n'exerce pas en Allemagne)<br>
      Particulier - projet non commercial<br>
      Moosburger Straße 10A<br>
      80993 Munich<br>
      Allemagne</p>
      <p>Email: checkmytoothbot@gmail.com</p>
      <p>Responsable du contenu selon § 55 alinéa 2 RStV :<br>
      Ismail Masmoudi</p>
      <p>Cette application est un projet privé non commercial créé par motivation personnelle pour l'éducation à la santé.<br>
      Elle ne génère pas de profits, ne contient pas de publicité et n'est pas utilisée commercialement.</p>
    `,
    de: `
      <h2>Impressum</h2>
      <p>Angaben gemäß § 5 TMG:</p>
      <p>Ismail Masmoudi<br>
      Zahnarzt (Studium in Algerien, nicht als Zahnarzt in Deutschland tätig)<br>
      Privatperson – keine gewerbliche Tätigkeit<br>
      Moosburger Straße 10A<br>
      80993 München<br>
      Deutschland</p>
      <p>E-Mail: checkmytoothbot@gmail.com</p>
      <p>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br>
      Ismail Masmoudi</p>
      <p>Diese App ist ein nicht-kommerzielles, privates Projekt, das aus persönlicher Motivation zur gesundheitlichen Aufklärung erstellt wurde.<br>
      Es erfolgt keine Gewinnerzielung, keine Werbung, und es besteht keine gewerbliche Nutzung.</p>
    `,
    ar: `
      <h2>بيانات الناشر</h2>
      <p>معلومات وفقًا للمادة 5 من قانون خدمات الإعلام عن بعد (TMG):</p>
      <p>إسماعيل مسمودي<br>
      طبيب أسنان (درس في الجزائر، ولا يمارس طب الأسنان في ألمانيا)<br>
      شخص خاص - مشروع غير تجاري<br>
      Moosburger Straße 10A<br>
      80993 ميونيخ<br>
      ألمانيا</p>
      <p>البريد الإلكتروني: checkmytoothbot@gmail.com</p>
      <p>المسؤول عن المحتوى وفقًا للمادة 55 الفقرة 2 من اتفاقية الدولة الإطارية للبث (RStV):<br>
      إسماعيل مسمودي</p>
      <p>هذا التطبيق هو مشروع خاص غير تجاري تم إنشاؤه بدافع شخصي للتثقيف الصحي.<br>
      لا يحقق ربحًا ولا يحتوي على إعلانات ولا يستخدم لأغراض تجارية.</p>
    `,
  };

  privacyContent = { /* Datenschutzhinweis hier */
    en: `<h2>Privacy Policy</h2><p>...</p>`,
    fr: `<h2>Politique de confidentialité</h2><p>...</p>`,
    de: `<h2>Datenschutz</h2><p>...</p>`,
    ar: `<h2>سياسة الخصوصية</h2><p>...</p>`,
  };

  disclaimerContent = { /* Haftungsausschluss hier */
    en: `<h2>Disclaimer / Medical Notice</h2><p>...</p>`,
    fr: `<h2>Avertissement / Avis médical</h2><p>...</p>`,
    de: `<h2>Haftungsausschluss / Medizinischer Hinweis</h2><p>...</p>`,
    ar: `<h2>إخلاء المسؤولية / إشعار طبي</h2><p>...</p>`,
  };

  aboutContent = { /* Über die App hier */
    en: `<h2>About CheckMyToothBot</h2><p>...</p>`,
    fr: `<h2>À propos de CheckMyToothBot</h2><p>...</p>`,
    de: `<h2>Über CheckMyToothBot</h2><p>...</p>`,
    ar: `<h2>حول CheckMyToothBot</h2><p>...</p>`,
  };

  getTranslation(key: string): string {
    return this.menuItems[key]?.[this.language] ?? `Missing: ${key}`;
  }
}